---
title: "Bypass CSRF form validation for Magento POST submissions"
date: "2019-01-29T17:45:00.000Z"
tags: ["magento", "magento2"]
---

Magento implements CSRF (Cross-Site Request Forgery) tokens on form POST submissions. This is designed to prevent unwanted actions from being executed while a user is currently authenticated.

In certain specific situations, you will need to disable CSRF for specific routes. For example, I recently stumbled across a situation when implementing Cybersource Secure Acceptance as a payment method using the Silent Direct Post payment processing implementation. The module had not yet been updated for Magento 2.3, and when submitting a credit card order, Cybersource would post back to Magento and the order submission would fail due to an "Invalid Form Key" error response, even though the Cybersource side of things was successful.

Whenever you come across an "Invalid Form Key" error, it typically means the CSRF token has either expired, or the token was incorrectly implemented. In this situation, Cybersource was posting back to Magento and there was no CSRF token in place, which would always lead to an error being thrown. The resolution is to disable CSRF, but just for this specific endpoint (`/cybersource/index/placeOrder`).

Instead of modifying the controller directly, I created a local module override for the Cybersource module. First I create a `Foo_SecureAcceptance` module (a good way to name a module overriding the `Cybersource_SecureAcceptance` module):

<div class="gatsby-code-title">Foo/SecureAcceptance/registration.php</div>

```php
<?php
\Magento\Framework\Component\ComponentRegistrar::register(
    \Magento\Framework\Component\ComponentRegistrar::MODULE,
    'Foo_SecureAcceptance',
    __DIR__
);
```

<div class="gatsby-code-title">Foo/SecureAcceptance/etc/module.xml</div>

```xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:Module/etc/module.xsd">
    <module name="Foo_SecureAcceptance" setup_version="1.0.0">
        <sequence>
            <module name="CyberSource_SecureAcceptance"/>
        </sequence>
    </module>
</config>
```

This is a simple module, using a class preference to override the `PlaceOrder` controller of the Cybersource Secure Acceptance module:

<div class="gatsby-code-title">Foo/SecureAcceptance/etc/di.xml</div>

```xml
<?xml version="1.0"?>
<config xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:ObjectManager/etc/config.xsd">
    <preference for="CyberSource\SecureAcceptance\Controller\Index\PlaceOrder" type="Foo\SecureAcceptance\Controller\Index\PlaceOrder"/>
</config>
```

For this class preference, I wanted to extend the existing `PlaceOrder` class. The difference with my controller being that it is implementing the `CsrfAwareActionInterface` interface. Implementing this interface requires the defining of two methods:

- *createCsrfValidationException*: responsible for throwing a validation exception
- *validateForCsrf*: whether this controller should be validated for CSRF

<div class="gatsby-code-title">Foo/SecureAcceptance/Controller/Index/PlaceOrder.php</div>

```php
<?php
namespace Foo\SecureAcceptance\Controller\Index;

use Magento\Framework\App\CsrfAwareActionInterface;
use Magento\Framework\App\Request\InvalidRequestException;
use Magento\Framework\App\RequestInterface;

class PlaceOrder extends \CyberSource\SecureAcceptance\Controller\Index\PlaceOrder implements CsrfAwareActionInterface
{
    /**
     * @inheritDoc
     */
    public function createCsrfValidationException(
        RequestInterface $request
    ): ?InvalidRequestException {
        return null;
    }

    /**
     * @inheritDoc
     */
    public function validateForCsrf(RequestInterface $request): ?bool
    {
        return true;
    }
}
```

By returning `null` for `createCsrfValidationException`, and `true` for `validateForCsrf`, no exception will be thrown, and the request will automatically confirm the CSRF validation for POST submissions.
