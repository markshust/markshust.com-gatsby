---
title: "Creating Magento Adminhtml Grids, simplified"
date: "2012-07-05T12:28:00.000Z"
tags: ["magento", "magento1", "xml"]
---

As with many coding projects with Magento, it is *very* easy to get frustrated, even with the smallest of tasks. Well, Adminhtml Grids in Magento aren't too much fun, even for the experienced programmer. Lacking quality tutorial posts on Google as well, I thought it was worthwhile to write up a constructed tutorial on how to create these Adminhtml Grids, in the most simplified manner possible.

**Note:** This article isn't for the faint of heart -- this is one of the more confusing Magento topics. If you find yourself not getting anywhere, please go back through all of the comments in the XML files below and make sure they all match appropriately to your module.

## Setup the XML

Let's go ahead and get started by creating your base module definition file and skeleton structure.

<div class="gatsby-code-title">app/etc/modules/Foo_Bar.xml</div>

```xml
<?xml version="1.0"?>
<config>
    <modules>
        <Foo_Bar>
            <active>true</active>
            <codePool>community</codePool>
        </Foo_Bar>
    </modules>
</config>
```

<div class="gatsby-code-title">app/code/community/Foo/Bar/etc/config.xml</div>

```xml
<?xml version="1.0"?>
<config>
    <modules>
        <Foo_Bar>
            <version>1.0.0</version>
        </Foo_Bar>
    </modules>
    <global>
        <helpers>
            <foo_bar>
                <!-- This is where we define our helper directory -->
                <class>Foo_Bar_Helper</class>
            </foo_bar>
        </helpers>
        <blocks>
            <foo_bar>
                <!-- Set a block definition and lookup directory -->
                <class>Foo_Bar_Block</class>
            </foo_bar>
        </blocks>
        <models>
            <foo_bar>
                <!-- This is where we define our model directory -->
                <class>Foo_Bar_Model</class>
                <!-- Define a resource to create a custom table -->
                <resourceModel>foo_bar_mysql4</resourceModel>
            </foo_bar>
             
            <!-- Here's our resource model we'll use to create a database table -->
            <foo_bar_mysql4>
                <class>Foo_Bar_Model_Mysql4</class>
                <entities>
                    <!-- Let's define our table, we'll call it with the baz name, but the real table is foo_bar_baz -->
                    <!-- After we define our entity, we can call it with our model by calling foo_bar/baz -->
                    <baz>
                        <table>foo_bar_baz</table>
                    </baz>
                </entities>
            </foo_bar_mysql4>
        </models>
        <!-- And finally we define our resource setup script -->
        <resources>
            <foo_bar_setup>
                <setup>
                    <module>Foo_Bar</module>
                </setup>
            </foo_bar_setup>
        </resources>
    </global>
    <admin>
        <routers>
            <adminhtml>
                <args>
                    <!-- This is how we load our Adminhtml controllers -->
                    <modules>
                        <Foo_Bar before="Mage_Adminhtml">Foo_Bar_Adminhtml</Foo_Bar>
                    </modules>
                </args>
            </adminhtml>
        </routers>
    </admin>
    <adminhtml>
        <layout>
            <updates>
                <foo_bar>
                    <!--
                    We again keep a nice naming convention and make our module upgrade proof by placing it in a separate folder
                    - Since we are in the adminhtml node, this will look for the XML file in the app/design/adminhtml/default/default root folder
                    -->
                    <file>foo/bar.xml</file>
                </foo_bar>
            </updates>
        </layout>
    </adminhtml>
</config>
```

Now, we can create our Adminhtml XML which defines where our URL shows up in the Admin menu and access control.

<div class="gatsby-code-title">app/code/community/Foo/Bar/etc/adminhtml.xml</div>

```xml
<?xml version="1.0"?>
<config>
    <menu>
        <!--
        This item will be created in the Admin menu under Sales
        - If you want another section, reference the appropriate adminhtml.xml file in app/code/core/Mage/Modulename/etc
        - For example, we found out this was 'sales' by referencing the config/menu node of app/code/core/Mage/Sales/etc/adminhtml.xml
        -->
        <sales>
            <children>
                <!-- Here, I like to use the namespacename_modulename_controllername naming convention -->
                <foo_bar_baz translate="title" module="foo_bar">
                    <!-- This is how the menu text will be displayed -->
                    <title>Baz</title>
                    <!-- This is the URL of what we want the menu item to link to -->
                    <action>adminhtml/baz</action>
                </foo_bar_baz>
            </children>
        </sales>
    </menu>
     
    <acl>
        <resources>
            <admin>
                <children>
                    <!-- Same as above, but instead of referencing the config/menu node, you reference the acl/resources node of adminhtml.xml -->
                    <sales>
                        <children>
                            <!-- Keep the same naming convention as above -->
                            <foo_bar_baz>
                                <!-- This is how the ACL text will be displayed on System > Permissions > Roles > Role > Role Resources -->
                                <title>Baz</title>
                            </foo_bar_baz>
                        </children>
                    </sales>
                </children>
            </admin>
        </resources>
    </acl>
</config>
```

<div class="gatsby-code-title">app/design/adminhtml/default/default/layout/foo/bar.xml</div>

```xml
<?xml version="1.0"?>
<layout>
    <!-- Here, we reference the XML node path of our route -->
    <adminhtml_baz_index>
        <reference name="content">
            <!-- We also reference our block by namespacename_modulename/adminhtml_controllername, and name it uniquely -->
            <block type="foo_bar/adminhtml_baz" name="foo_bar_baz" />
        </reference>
    </adminhtml_baz_index>
</layout>
```

## Setup the helper

We need to create a php file for our helper. There won't be anything in it, but we still need it there to properly load the helper. The name of the default helper is `Data`, so we will create just that.

<div class="gatsby-code-title">app/code/community/Foo/Bar/Helper/Data.php</div>

```php
<?php
class Foo_Bar_Helper_Data extends Mage_Core_Helper_Abstract
{
}
```

## Setup our custom model, resource and collection

Our grid needs some data, so let's go ahead and setup a very small database table with just an ID and Name fields.

<div class="gatsby-code-title">app/code/community/Foo/Bar/Helper/Data.php</div>

```php
<?php
/* @var $installer Mage_Core_Model_Resource_Setup */
$installer = $this;
$installer->startSetup();
 
/**
 * Create table 'foo_bar_baz'
 */
$table = $installer->getConnection()
    // The following call to getTable('foo_bar/baz') will lookup the resource for foo_bar (foo_bar_mysql4), and look
    // for a corresponding entity called baz. The table name in the XML is foo_bar_baz, so ths is what is created.
    ->newTable($installer->getTable('foo_bar/baz'))
    ->addColumn('id', Varien_Db_Ddl_Table::TYPE_INTEGER, null, array(
        'identity'  => true,
        'unsigned'  => true,
        'nullable'  => false,
        'primary'   => true,
        ), 'ID')
    ->addColumn('name', Varien_Db_Ddl_Table::TYPE_CLOB, 0, array(
        'nullable'  => false,
        ), 'Name');
$installer->getConnection()->createTable($table);
 
$installer->endSetup();
```

Now, the first time you clear your cache and Magento sees your module at version 1.0.0, it will execute the above sql script and create your foo_bar_baz table.

Now that our foo_bar_baz table has been created, we'll create a base model, then a resource and tie it into our collection.

<div class="gatsby-code-title">app/code/community/Foo/Bar/Model/Baz.php</div>

```php
<?php
class Foo_Bar_Model_Baz extends Mage_Core_Model_Abstract
{
    protected function _construct()
    {  
        $this->_init('foo_bar/baz');
    }  
}
```

<div class="gatsby-code-title">app/code/community/Foo/Bar/Model/Mysql4/Baz.php</div>

```php
<?php
class Foo_Bar_Model_Mysql4_Baz extends Mage_Core_Model_Mysql4_Abstract
{
    protected function _construct()
    {  
        $this->_init('foo_bar/baz', 'id');
    }  
}
```

<div class="gatsby-code-title">app/code/community/Foo/Bar/Model/Mysql4/Baz/Collection.php</div>

```php
<?php
class Foo_Bar_Model_Mysql4_Baz_Collection extends Mage_Core_Model_Mysql4_Collection_Abstract
{
    protected function _construct()
    {  
        $this->_init('foo_bar/baz');
    }  
}
```

## Start coding up the Grid<

That's all she wrote for the XML of Adminhtml Grids, so now we are onto some PHP. Let's move on to creating our grid block and controller.

First, we'll setup our block grid container, which will kick off our grid rendering within Magento. Remembering how Magento works,when we call our block as `foo_bar/adminhtml_baz`, it will automatically be looking for a file at `Foo/Bar/Block/Adminhtml/Baz`. We will also extend Magento's block widget grid container.

<div class="gatsby-code-title">app/code/community/Foo/Bar/Block/Adminhtml/Baz.php</div>

```php
<?php
class Foo_Bar_Block_Adminhtml_Baz extends Mage_Adminhtml_Block_Widget_Grid_Container
{
    public function __construct()
    {
        // The blockGroup must match the first half of how we call the block, and controller matches the second half
        // ie. foo_bar/adminhtml_baz
        $this->_blockGroup = 'foo_bar';
        $this->_controller = 'adminhtml_baz';
        $this->_headerText = $this->__('Baz');
         
        parent::__construct();
    }
}
```

After the grid container is setup, we create the class housing our actual grid code, which is almost at the same place as the container, just a directory deeper, and with the file named `Grid.php`, and extending `Mage_Adminhtml_Block_Widget_Grid`.

<div class="gatsby-code-title">app/code/community/Foo/Bar/Block/Adminhtml/Baz/Grid.php</div>

```php
<?php
class Foo_Bar_Block_Adminhtml_Baz_Grid extends Mage_Adminhtml_Block_Widget_Grid
{
    public function __construct()
    {
        parent::__construct();
         
        // Set some defaults for our grid
        $this->setDefaultSort('id');
        $this->setId('foo_bar_baz_grid');
        $this->setDefaultDir('asc');
        $this->setSaveParametersInSession(true);
    }
     
    protected function _getCollectionClass()
    {
        // This is the model we are using for the grid
        return 'foo_bar/baz_collection';
    }
     
    protected function _prepareCollection()
    {
        // Get and set our collection for the grid
        $collection = Mage::getResourceModel($this->_getCollectionClass());
        $this->setCollection($collection);
         
        return parent::_prepareCollection();
    }
     
    protected function _prepareColumns()
    {
        // Add the columns that should appear in the grid
        $this->addColumn('id',
            array(
                'header'=> $this->__('ID'),
                'align' =>'right',
                'width' => '50px',
                'index' => 'id'
            )
        );
         
        $this->addColumn('name',
            array(
                'header'=> $this->__('Name'),
                'index' => 'name'
            )
        );
         
        return parent::_prepareColumns();
    }
     
    public function getRowUrl($row)
    {
        // This is where our row data will link to
        return $this->getUrl('*/*/edit', array('id' => $row->getId()));
    }
}
```

And also create an Edit.php file along with an Edit/Form.php file, which both control how the edit form loads and is displayed.

<div class="gatsby-code-title">app/code/community/Foo/Bar/Block/Adminhtml/Baz/Edit.php</div>

```php
<?php
class Foo_Bar_Block_Adminhtml_Baz_Edit extends Mage_Adminhtml_Block_Widget_Form_Container
{
    /**
     * Init class
     */
    public function __construct()
    {  
        $this->_blockGroup = 'foo_bar';
        $this->_controller = 'adminhtml_baz';
     
        parent::__construct();
     
        $this->_updateButton('save', 'label', $this->__('Save Baz'));
        $this->_updateButton('delete', 'label', $this->__('Delete Baz'));
    }  
     
    /**
     * Get Header text
     *
     * @return string
     */
    public function getHeaderText()
    {  
        if (Mage::registry('foo_bar')->getId()) {
            return $this->__('Edit Baz');
        }  
        else {
            return $this->__('New Baz');
        }  
    }  
}
```

<div class="gatsby-code-title">app/code/community/Foo/Bar/Block/Adminhtml/Baz/Edit/Form.php</div>

```php
<?php
class Foo_Bar_Block_Adminhtml_Baz_Edit_Form extends Mage_Adminhtml_Block_Widget_Form
{
    /**
     * Init class
     */
    public function __construct()
    {  
        parent::__construct();
     
        $this->setId('foo_bar_baz_form');
        $this->setTitle($this->__('Baz Information'));
    }  
     
    /**
     * Setup form fields for inserts/updates
     *
     * return Mage_Adminhtml_Block_Widget_Form
     */
    protected function _prepareForm()
    {  
        $model = Mage::registry('foo_bar');
     
        $form = new Varien_Data_Form(array(
            'id'        => 'edit_form',
            'action'    => $this->getUrl('*/*/save', array('id' => $this->getRequest()->getParam('id'))),
            'method'    => 'post'
        ));
     
        $fieldset = $form->addFieldset('base_fieldset', array(
            'legend'    => Mage::helper('checkout')->__('Baz Information'),
            'class'     => 'fieldset-wide',
        ));
     
        if ($model->getId()) {
            $fieldset->addField('id', 'hidden', array(
                'name' => 'id',
            ));
        }  
     
        $fieldset->addField('name', 'text', array(
            'name'      => 'name',
            'label'     => Mage::helper('checkout')->__('Name'),
            'title'     => Mage::helper('checkout')->__('Name'),
            'required'  => true,
        ));
     
        $form->setValues($model->getData());
        $form->setUseContainer(true);
        $this->setForm($form);
     
        return parent::_prepareForm();
    }  
}
```

Now, our admin routing was setup before, which told Magento to look in Packagename/Modulename/controllers/Adminhtml for our controller. So, we just create a controller just as we would for the frontend, just in this directory instead, and also extend Mage_Adminhtml_Controller_Action instead of Mage_Core_Controller_Front_Action.

<div class="gatsby-code-title">app/code/community/Foo/Bar/controllers/Adminhtml/BazController.php</div>

```php
<?php
class Foo_Bar_Adminhtml_BazController extends Mage_Adminhtml_Controller_Action
{
    public function indexAction()
    {  
        // Let's call our initAction method which will set some basic params for each action
        $this->_initAction()
            ->renderLayout();
    }  
     
    public function newAction()
    {  
        // We just forward the new action to a blank edit form
        $this->_forward('edit');
    }  
     
    public function editAction()
    {  
        $this->_initAction();
     
        // Get id if available
        $id  = $this->getRequest()->getParam('id');
        $model = Mage::getModel('foo_bar/baz');
     
        if ($id) {
            // Load record
            $model->load($id);
     
            // Check if record is loaded
            if (!$model->getId()) {
                Mage::getSingleton('adminhtml/session')->addError($this->__('This baz no longer exists.'));
                $this->_redirect('*/*/');
     
                return;
            }  
        }  
     
        $this->_title($model->getId() ? $model->getName() : $this->__('New Baz'));
     
        $data = Mage::getSingleton('adminhtml/session')->getBazData(true);
        if (!empty($data)) {
            $model->setData($data);
        }  
     
        Mage::register('foo_bar', $model);
     
        $this->_initAction()
            ->_addBreadcrumb($id ? $this->__('Edit Baz') : $this->__('New Baz'), $id ? $this->__('Edit Baz') : $this->__('New Baz'))
            ->_addContent($this->getLayout()->createBlock('foo_bar/adminhtml_baz_edit')->setData('action', $this->getUrl('*/*/save')))
            ->renderLayout();
    }
     
    public function saveAction()
    {
        if ($postData = $this->getRequest()->getPost()) {
            $model = Mage::getSingleton('foo_bar/baz');
            $model->setData($postData);
 
            try {
                $model->save();
 
                Mage::getSingleton('adminhtml/session')->addSuccess($this->__('The baz has been saved.'));
                $this->_redirect('*/*/');
 
                return;
            }  
            catch (Mage_Core_Exception $e) {
                Mage::getSingleton('adminhtml/session')->addError($e->getMessage());
            }
            catch (Exception $e) {
                Mage::getSingleton('adminhtml/session')->addError($this->__('An error occurred while saving this baz.'));
            }
 
            Mage::getSingleton('adminhtml/session')->setBazData($postData);
            $this->_redirectReferer();
        }
    }
     
    public function messageAction()
    {
        $data = Mage::getModel('foo_bar/baz')->load($this->getRequest()->getParam('id'));
        echo $data->getContent();
    }
     
    /**
     * Initialize action
     *
     * Here, we set the breadcrumbs and the active menu
     *
     * @return Mage_Adminhtml_Controller_Action
     */
    protected function _initAction()
    {
        $this->loadLayout()
            // Make the active menu match the menu config nodes (without 'children' inbetween)
            ->_setActiveMenu('sales/foo_bar_baz')
            ->_title($this->__('Sales'))->_title($this->__('Baz'))
            ->_addBreadcrumb($this->__('Sales'), $this->__('Sales'))
            ->_addBreadcrumb($this->__('Baz'), $this->__('Baz'));
         
        return $this;
    }
     
    /**
     * Check currently called action by permissions for current user
     *
     * @return bool
     */
    protected function _isAllowed()
    {
        return Mage::getSingleton('admin/session')->isAllowed('sales/foo_bar_baz');
    }
}
```
