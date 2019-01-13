---
title: "How to implement LESS CSS into Magento"
date: "2011-12-12T15:08:00.000Z"
tags: ["css", "less", "magento", "magento1"]
---

A while ago, I stumbled across <a href="http://lesscss.org/" target="_blank">LESS CSS</a>, a dynamic CSS processor which can greatly cleanse the amount of CSS in your website, and lead to generally more accessible cross-browser stylesheet conventions. LESS allows you to reuse your CSS snippets programmatically, and once you use it, you will never go back!

I was recently wondering how to implement such a solution in a fresh Magento installation. The typical Magento projects that I have been involved with have a great amount of CSS in many different files, which leads to a big pile of unmanageable, unmaintainable bloat, and unfortunately this is commonplace in just about every Magento install. Implementing LESS CSS is very easy, if you keep it easy.

I was worried about the performance hit a site would take if implementing LESS CSS, so I suggest the <a href="http://incident57.com/less/" target="_blank">LESS.app for Mac</a> and manual compilation, and just referencing the custom.css file directly in your XML. This will keep client rendering to an absolute minimum and avoid unnecessary JavaScript calls, while still leading to a very efficient way to manage your custom CSS. I created a custom base LESS CSS file from a variety of mixins that I found online (I'm sorry for not crediting the originators -- you know who you are -- your help is vastly appreciated). Just throw this file in:

`skin/frontend/yourpackage/yourdesign/css/custom.less`

Edit the file as usual at the bottom below the Custom comment, then compile it with LESS.app to:

`skin/frontend/yourpackage/yourdesign/css/custom.css`

Make sure that custom.css is referenced added to the list of css files in your design's local.xml file. This gives you all the benefits of LESS without ANY additional overhead, and will lead to much more streamlined and maintainable Magento installations.

The base LESS CSS file was created in the supplied format for a variety of reasons. Spacing was kept prevalent because it greatly increases readability. Specific directives were kept on separate lines so changes to the file can be seen in greater detail when using version control. And lastly, four spaces were used instead of tabs because this keeps with the standard Zend/Magento coding guidelines and standards.

Please feel free to post beneficial mixins and I will try to add them to the file on GitHub. Happy CSS coding!

<a href="https://github.com/markoshust/LESS-CSS-General-Mixins/blob/master/custom.less" target="_blank">Download my base LESS CSS mixin file here</a> or see below!

```less:title=skin/frontend/yourpackage/yourdesign/css/custom.less
/* Mixins */
.border-radius (
    @radius: 5px
) {
    -webkit-border-radius: @radius;
    -moz-border-radius: @radius;
    border-radius: @radius;
}

.border-radius-custom (
    @topleft: 5px,
    @topright: 5px,
    @bottomleft: 5px,
    @bottomright: 5px
) {
    -webkit-border-radius: @topleft @topright @bottomright @bottomleft;
    -moz-border-radius: @topleft @topright @bottomright @bottomleft;
    border-radius: @topleft @topright @bottomright @bottomleft;
}

.box-shadow (
    @x: 0px,
    @y: 3px,
    @blur: 5px,
    @alpha: 0.5
) {
    -webkit-box-shadow: @x @y @blur rgba(0, 0, 0, @alpha);
    -moz-box-shadow: @x @y @blur rgba(0, 0, 0, @alpha);
    box-shadow: @x @y @blur rgba(0, 0, 0, @alpha);
}

.text_shadow(
    @amount: 1px,
    @color: #fff
) {
    text-shadow: 0 @amount 0 @color;
}

.opacity(
    @op:100
) {
    filter: alpha(opacity=@op);
    -moz-opacity: @op/100;
    -khtml-opacity: @op/100;
    opacity: @op/100;
}

.transition (
    @prop: all,
    @time: 1s,
    @ease: linear
) {
    -webkit-transition: @prop @time @ease;
    -moz-transition: @prop @time @ease;
    -o-transition: @prop @time @ease;
    -ms-transition: @prop @time @ease;
    transition: @prop @time @ease;
}

.transform (
    @rotate: 90deg,
    @scale: 1,
    @skew: 1deg,
    @translate: 10px
) {
    -webkit-transform: rotate(@rotate) scale(@scale) skew(@skew) translate(@translate);
    -moz-transform: rotate(@rotate) scale(@scale) skew(@skew) translate(@translate);
    -o-transform: rotate(@rotate) scale(@scale) skew(@skew) translate(@translate);
    -ms-transform: rotate(@rotate) scale(@scale) skew(@skew) translate(@translate);
    transform: rotate(@rotate) scale(@scale) skew(@skew) translate(@translate);
}

.skew (
    @x: 35,
    @y: 0
) {
    -webkit-transform: skew(formatstring("{0}deg", @x), formatstring("{0}deg", @y));
    -moz-transform: skew(formatstring("{0}deg", @x), formatstring("{0}deg", @y));
    -o-transform: skew(formatstring("{0}deg", @x), formatstring("{0}deg", @y));
    -ms-transform: skew(formatstring("{0}deg", @x), formatstring("{0}deg", @y));
    transform: skew(formatstring("{0}deg", @x), formatstring("{0}deg", @y));
}
 
.scale (
    @x: 1
) {
    -webkit-transform: scale(@x);
    -moz-transform: scale(@x);
    -o-transform: scale(@x);
    -ms-transform: scale(@x);
    transform: scale(@x);
}
 
.rotate (
    @deg:35
) {
    -webkit-transform: rotate(formatstring("{0}deg", @deg));
    -moz-transform: rotate(formatstring("{0}deg", @deg));
    -o-transform: rotate(formatstring("{0}deg", @deg));
    -ms-transform: rotate(formatstring("{0}deg", @deg));
    transform: rotate(formatstring("{0}deg", @deg));
}
 
.translate (
    @x: 10px,
    @y: 10px
) {
    -webkit-transform: translate(@x, @y);
    -moz-transform: translate(@x, @y);
    -o-transform: translate(@x, @y);
    -ms-transform:translate(@x, @y);
    transform: translate(@x, @y);
}

.gradient (
    @origin: left,
    @start: #ffffff,
    @stop: #000000
) {
    background-color: @start;
    background-image: -webkit-linear-gradient(@origin, @start, @stop);
    background-image: -moz-linear-gradient(@origin, @start, @stop);
    background-image: -o-linear-gradient(@origin, @start, @stop);
    background-image: -ms-linear-gradient(@origin, @start, @stop);
    background-image: linear-gradient(@origin, @start, @stop);
}

.quick-gradient (
    @origin: left,
    @alpha: 0.2
) {
    background-image: -webkit-linear-gradient(@origin, rgba(0,0,0,0.0), rgba(0,0,0,@alpha));
    background-image: -moz-linear-gradient(@origin, rgba(0,0,0,0.0), rgba(0,0,0,@alpha));
    background-image: -o-linear-gradient(@origin, rgba(0,0,0,0.0), rgba(0,0,0,@alpha));
    background-image: -ms-linear-gradient(@origin, rgba(0,0,0,0.0), rgba(0,0,0,@alpha));
    background-image: linear-gradient(@origin, rgba(0,0,0,0.0), rgba(0,0,0,@alpha));
}

.ribbon (
    @height: 44px,
    @color: #FF2F96,
    @shadow-color: #e5e5e5,
    @shadow-size: 5px
) {
    /*
     * The height amount must be even.
     *
     * The HTML needs to look like this:
     * 
     * <hx>
     *     <a>Ribbon Text</a>
     *     <span></span>
     * </hx>
     *
     */
    
    position: relative;
    
    &:before {
        z-index: 43;
        content: "";
        background-color: @color;
        display: block;
        height: 10px;
        width: 10px;
        position: absolute;
        bottom: 0;
        left: 0px;
    }
    a {
        z-index: 40;
        background-color: @color;
        height: @height;
        line-height: @height;
        display: inline-block;
        text-decoration: none;
        position: relative;
        padding-left: @height;
        padding-right: @height/2;
        text-shadow: 0px 1px 0px darken(@color, 30%);
        
        box-shadow: 8px @shadow-size 0px @shadow-color;
        -moz-box-shadow: 8px @shadow-size 0px @shadow-color;
        -webkit-box-shadow: 8px @shadow-size 0px @shadow-color;
        
        border-top-left-radius: 2px;
        -moz-border-radius-topleft: 2px;
        -webkit-border-top-left-radius: 2px;
        
        -webkit-background-clip: padding-box;
        
        &:after {
            content: "";
            border: @height/2 solid @color;
            border-right-color: transparent;
            display: block;
            height: 0px;
            width: 0px;
            position: absolute;
            top: 0;
            right: -2 * (@height/2);
        }
        &:before {
            content: "";
            border: @height/2 solid @shadow-color;
            border-right-color: transparent;
            display: block;
            height: 0px;
            width: 0px;
            position: absolute;
            top: @shadow-size;
            right: -2 * (@height/2) - 2px;
        }
    }
    span {
        &:after {
            z-index: 42;
            content: "";
            position: absolute;
            bottom: -7px;
            left: -6px;
            display: block;
            height: 0px;
            width: 0px;
            border: 7px solid black;
            border-left-color: transparent;
            border-bottom-color: transparent;
            border-top-color: transparent;
        }
        &:before {
            z-index: 41;
            content: "";
            position: absolute;
            bottom: -8px;
            left: -8px;
            display: block;
            height: 0px;
            width: 0px;
            border: 8px solid @color;
            border-left-color: transparent;
            border-bottom-color: transparent;
            border-top-color: transparent;
        }
    }
}

/* Custom */
```
