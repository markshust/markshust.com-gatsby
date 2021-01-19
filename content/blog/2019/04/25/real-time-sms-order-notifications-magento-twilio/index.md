---
title: "Real-Time SMS Order Notifications with Magento and Twilio"
date: "2019-04-25T12:00:00.000Z"
tags: ["magento", "magento2", "twilio"]
canonical: "https://www.twilio.com/blog/real-time-sms-order-notifications-magento-twilio-php"
---

Managing your own storefront and competing with Amazon can be difficult, especially due to their ability to automate and process orders much faster than their competition. While you may not be able to setup an expensive <a href="https://www.formaxprinting.com/blog/2010/06/what-is-pick-and-pack-fulfillment/" target="_blank">pick and pack fulfillment</a> system & process, there are ways in which you can implement a solution much more quickly and affordably. One of those ways is to implement the Twilio API into your <a href="https://magento.com/" target="_blank">Magento</a> storefront for real-time SMS order notifications.

The <a href="https://www.twilio.com/docs/libraries/php" target="_blank">Twilio PHP Helper Library</a> makes it relatively simple & easy to integrate real-time notifications into your Magento store. In this tutorial, we will walk through all of the steps needed to integrate Twilio with Magento so you can pick & pack incoming orders as soon as they come in.

## Technical Requirements

For this tutorial we'll assume the following:

- You have a running instance of Magento 2.3+ installed with products or sample data
- You have <a href="https://getcomposer.org/" target="_blank">Composer</a> installed globally
- You have a <a href="https://www.twilio.com/" target="_blank">Twilio</a> account setup
- You have basic OOP PHP knowledge

## Create a Magento Module

Custom-coded modules in Magento are typically placed at `app/code/{VENDOR_NAME}/{MODULE_NAME}`. We will assume our vendor name is “Acme" and our module name is "Twilio". Let's go ahead and create these folders:

```bash
$ mkdir -p app/code/Acme/Twilio
```

A Magento module typically requires two files, `registration.php` and `module.xml`.

Let's create our `registration.php` file at `app/code/Acme/Twilio/registration.php` with the following contents:

<div class="gatsby-code-title">app/code/Acme/Twilio/registration.php</div>

```php
<?php
use Magento\Framework\Component\ComponentRegistrar;

ComponentRegistrar::register(ComponentRegistrar::MODULE, 'Acme_Twilio', __DIR__);
```

This file makes Magento aware of our module, and registers it with the bootloader.

Next we'll create a file at `app/code/Acme/Twilio/etc/module.xml` with the following contents:

<div class="gatsby-code-title">app/code/Acme/OrderNotifications/etc/module.xml</div>

```xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Module/etc/module.xsd">
    <module name="Acme_Twilio" setup_version="1.0.0" />
</config>
```

This file defines our module configuration, and helps Magento keep track of our module versioning scheme.

At this point we have enough setup for Magento to recognize our code as a valid module. Let's now enable the module with Magento's bin helper script. In your terminal, run the following command:

```bash
$ bin/magento module:enable Acme_Twilio
```

Then, run the setup upgrade script to ensure our versioning scheme is registered with Magento, and caches are cleared:

```bash
$ bin/magento setup:upgrade
```

When this command completes, our module will be registered and enabled. We can confirm the module is registered and installed by seeing it's output in the result of the command:

```bash
$ bin/magento module:status
```

## Install the Twilio SDK Composer Dependency

In order to install the Twilio PHP Helper Library, we need to use Composer to install the `twilio/sdk` library. Go into the root of your Magento instance and run:

```bash
$ composer require twilio/sdk
```

This will install the Twilio SDK, and you can locate the installed library code at `vendor/twilio/sdk`. Installing the SDK with this method will ensure easy upgrades for the library, and prevent unneeded files from entering our version control system.

Feel free to walk around those source files and get familiar with the SDK. You can also reference the <a href="https://www.twilio.com/docs/libraries/php" target="_blank">full documentation</a> for the Twilio PHP Helper Library.

## Implement the Event Observer

There are many design patterns to consider within Magento 2, including the use of <a href="https://devdocs.magento.com/guides/v2.3/extension-dev-guide/plugins.html" target="_blank">interceptors</a>, <a href="https://devdocs.magento.com/guides/v2.3/extension-dev-guide/build/di-xml-file.html#abstraction-implementation-mappings" target="_blank">class preferences</a>, and <a href="https://devdocs.magento.com/guides/v2.3/extension-dev-guide/events-and-observers.html" target="_blank">publish-subscribe</a>, amongst others. Determining which design pattern to use is important, as the most ideal pattern will be less prone to errors during upgrades, and help make updates reliable & easy.

Digesting these three most common patterns:

- Interceptors are typically used to change or update existing functionality.
- Class preferences are used when you cannot implement a plugin due to PHP variable visibility constraints, or when using a plugin is not possible.
- Publish-subscribe is typically used when an action is emitted, and you need to respond to a specific event.

After analyzing these possible patterns and implementation methods, which choice is best? The ideal choice is the **publish-subscribe** pattern (which is implemented via event observers), since we need to respond to a specific event (an order being placed), and the checkout request/response is not dependent upon the result of our desired action (calling Twilio, an external third-party API).

There are <a href="https://cyrillschumacher.com/magento-2.3-list-of-all-dispatched-events/" target="_blank">many events dispatched in Magento 2.3</a>, and the choice of which event to use is dependent upon our desired trigger, and the resulting object that will be passed to our observer from that dispatched event.

There is probably more than one event we can listen on, but we do not want the dispatched event to be dependent upon a specific payment type, or a specific checkout sequence. Wwe want it to trigger for both frontend orders, and orders placed manually from within the admin. Since we do not want any unnecessary dependencies, we will look only in the `Magento/Sales/Model/Order.php` class which is the main model which would emit the event we are looking to tap into. That leads us to the `sales_order_place_after` event, which only triggers after an order transaction has been executed. The following line is the code which dispatches the event, passing in `$this` (a reference to the Order model) as an `order` parameter to the event:

```php
$this->_eventManager->dispatch('sales_order_place_after', ['order' => $this]);
```

Now that we know the event we will listen for, let's create an observer that will be triggered when the event is dispatched.

Create an `Observer` directory within our module structure, and then a file named `app/code/Acme/Twilio/Observer/SendOrderNotification.php` with the following contents:

<div class="gatsby-code-title">app/code/Acme/Twilio/Observer/SendOrderNotification.php</div>

```php
namespace Acme\Twilio\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;

class SendOrderNotification implements ObserverInterface
{
    public function execute(
        Observer $observer
    ) {
        $order = $observer->getData('order');

        // our Twilio code goes here
    }
}
```

Note that observers extend the `ObserverInterface`, which implement the `execute` method. A good practice is to name your observer with the actual action you are implementing in sort of a human language ("send order notification"). Observers should only have one specific action to implement.

We can access the order information of the placed order by accessing `$observer->getData('order')`. The `getData` function allows us to get the parameter passed in from the `['order' => $this]` parameter emitted from the `sales_order_place_after` action.

Next, we link up the event with our observer within a file at `app/code/Acme/Twilio/etc/events.xml`:

<div class="gatsby-code-title">app/code/Acme/OrderNotifications/etc/events.xml</div>

```xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Event/etc/events.xsd">
    <event name="sales_order_place_after">
        <observer name="acme_twilio_sendOrderNotification" instance="Acme\Twilio\Observer\SendOrderNotification" />
    </event>
</config>
```

Note how we prefix the observer name with the name of our namespace and module name (`acme_twilio_`). This is added to avoid the possibility of namespace collisions with other modules.

## Send Order To Twilio

Now comes the time to add in the Twilio code which will send our SMS when an order is placed. Our first step is to get our Twilio Account SID and Auth Token. These are located on the right side of your <a href="https://www.twilio.com/console" target="_blank">Twilio Console</a>.

Once you have located your SID and Token, let's import the Twilio REST client library at the top of our observer. Note though, instead of using `Twilio\Rest\Client`, we will import `Twilio\Rest\ClientFactory`, then use that factory class to create our `Client` within the `execute` method. The `Client` object's constructor expects `$username` and `$password` variables, so we will define those and pass in our Twilio SID and Token, respectively. When we call the `create` function on the client factory, that is what will create and instantiate the client object we wish to use.

Our `Observer` class will now look like this:

<div class="gatsby-code-title">app/code/Acme/Twilio/Observer/SendOrderNotification.php</div>

```php
<?php
namespace Acme\Twilio\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;
use Twilio\Rest\ClientFactory;

class SendOrderNotification implements ObserverInterface
{
    const TWILIO_SID = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    const TWILIO_TOKEN = 'your_auth_token';

    protected $clientFactory;

    public function __construct(
        ClientFactory $clientFactory
    ) {
        $this->clientFactory = $clientFactory;
    }

    public function execute(Observer $observer)
    {
        $order = $observer->getData('order');
        $client = $this->clientFactory->create([
            'username' => self::TWILIO_SID,
            'password' => self::TWILIO_TOKEN,
        ]);
    }
}
```

Let's now work on the body of the message we wish to send. It's best to consolidate this into its own function so it is easily readable and testable in the future.

The main information we need is the Order ID, the requested shipping method for the order, along with a list of each of the products ordered along with their quantity. Since our goal is to expedite our pick and pack process, this is the main data we need to expedite our process.

```php
<?php

public function getBody($order)
{
    $incrementId = $order->getData('increment_id');
    $shippingDescription = $order->getData('shipping_description');
    $result = "New order: #$incrementId" . PHP_EOL;
    $result .= PHP_EOL;
    $result .= "Shipping method: $shippingDescription" . PHP_EOL;
    $result .= PHP_EOL;

    foreach ($order->getData('items') as $item) {
        $qty = $item->getData('qty_ordered');
        $sku = $item->getData('sku');
        $name = $item->getData('name');
        $result .= "[$qty x $sku] $name" . PHP_EOL;
    }

    return $result;
}
```

By adding in calls to `PHP_EOL`, we can add extra line breaks to the body of our message to make the contents of our message easier to read.

Our final step is to actually send the SMS. The function responsible for making that call is `$client->messages->create()`, which expects two parameters. The first parameter is the number you'd like to send the message to, and the second is an array containing the values for which your Twilio number is sending the message, along with the body of the text you wish to send.

```php
<?php
$params = [
    'from' => self::TWILIO_NUMBER,
    'body' => $this->getBody($order),
];
$client->messages->create(self::SEND_TO_NUMBER, $params);
```

Since it's possible `create` could throw an exception, let's wrap this call within a `try catch` statement, and also implement the `LoggerInterface` to write any exceptions to a log file for diagnosis. Our final observer class will resemble the following (be sure to update the values for the constants to your appropriately desired values):

<div class="gatsby-code-title">app/code/Acme/Twilio/Observer/SendOrderNotification.php</div>

```php
<?php
namespace Acme\OrderNot<?php
namespace Acme\Twilio\Observer;

use Magento\Framework\Event\Observer;
use Magento\Framework\Event\ObserverInterface;
use Psr\Log\LoggerInterface;
use Twilio\Rest\ClientFactory;

class SendOrderNotification implements ObserverInterface
{
    const TWILIO_SID = 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    const TWILIO_TOKEN = 'your_auth_token';
    const TWILIO_NUMBER = '+12165551212';
    const SEND_TO_NUMBER = '+12165551313';

    private $clientFactory;
    private $logger;

    public function __construct(
        ClientFactory $clientFactory,
        LoggerInterface $logger
    ) {
        $this->clientFactory = $clientFactory;
        $this->logger = $logger;
    }

    public function execute(Observer $observer)
    {
        $order = $observer->getData('order');
        $client = $this->clientFactory->create([
            'username' => self::TWILIO_SID,
            'password' => self::TWILIO_TOKEN,
        ]);
        $params = [
            'from' => self::TWILIO_NUMBER,
            'body' => $this->getBody($order),
        ];

        try {
            $client->messages->create(self::SEND_TO_NUMBER, $params);
        } catch (\Exception $e) {
            $this->logger->critical('Error message', ['exception' => $e]);
        }
    }

    public function getBody($order)
    {
        $incrementId = $order->getData('increment_id');
        $shippingDescription = $order->getData('shipping_description');
        $result = "New order: #$incrementId" . PHP_EOL;
        $result .= PHP_EOL;
        $result .= "Shipping method: $shippingDescription" . PHP_EOL;
        $result .= PHP_EOL;

        foreach ($order->getData('items') as $item) {
            $qty = $item->getData('qty_ordered');
            $sku = $item->getData('sku');
            $name = $item->getData('name');
            $result .= "[$qty x $sku] $name" . PHP_EOL;
        }

        return $result;
    }
}
```

Now place an order through your Magento instance. You should receive an SMS message resembling the following:

![SMS Result](sms-result.png)

## Debugging Common Errors

In the event your SMS messages are not being sent, the first thing to do would be to check the logs. Exceptions are typically written to the `var/log/exception.log` file.

If after diagnosing your code throws an exception with a message such as:

```
main.CRITICAL: Error message {"exception":"[object] (Twilio\\Exceptions\\RestException(code: 20404): [HTTP 404] Unable to create record: The requested resource /2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Messages.json was not found at /var/www/html/vendor/twilio/sdk/Twilio/Version.php:85)"} []
```

It means that your Account SID was not found or is incorrect. Double-check that your SID is set correctly, then try testing again.

Similarly, if you receive a response such as:

```
main.CRITICAL: Error message {"exception":"[object] (Twilio\\Exceptions\\RestException(code: 20003): [HTTP 401] Unable to create record: Authenticate at /var/www/html/vendor/twilio/sdk/Twilio/Version.php:85)"} []
```

It usually means your Twilio token value is incorrect.

## Expanded Functionality & Conclusion

The Twilio API credentials and information were hard-coded as constants into our class. It is much better to implement these details as encrypted configuration values that can be easily updatable from the admin interface. You can then call the configuration values from within your class where appropriate. This method is much more secure and highly recommended.

The code in this article has been somewhat abridged and simplified in comparison to an actual implementation. A fully implemented module for the code mentioned in this article has been publlished to <a href="https://github.com/markshust/magento2-module-twilio" target="_blank">https://github.com/markshust/magento2-module-twilio</a>. Feel free to modify and extend the functionality within this module to your liking, and explore the differences between the code mentioned in this article versus the code within the published module.

You can implement the Twilio SMS functionality in any number of areas of Magento, such as when a customer registers with your store, when a specific promo code is used, and so on. The possibilities are endless.

I hope this post has inspired and opened your mind to what is possible with the Twilio API. The API is extremely simple to work with, and you can come up with all sorts of implementation ideas dependant upon your specific use-case.

> *This blog post was originally posted on Twilio's website at <a href="https://www.twilio.com/blog/real-time-sms-order-notifications-magento-twilio-php" target="_blank">https://www.twilio.com/blog/real-time-sms-order-notifications-magento-twilio-php</a>*.
