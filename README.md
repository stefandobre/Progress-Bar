# Plug-in archived!

This plug-in is no longer maintained. Please refer to the [FOS Progess Bar](https://fos.world/ords/f?p=10000:4040), which is maintained and offers support.


# Oracle APEX Plug-in: Progress Bar

![](https://img.shields.io/badge/Type-Item-orange.svg) ![](https://img.shields.io/badge/APEX-18.2-success.svg) ![](https://img.shields.io/badge/APEX-19.1-success.svg)

Check out the Demo: https://apex.oracle.com/pls/apex/f?p=60314:20

### About

A simple item type plug-in displaying a progress bar. It can be used to show a static percentage, or controlled/scripted via Dynamic Actions or JavaScript for dynamic changes.

### Configuration

#### Size

* Small - 24px height
* Large - 48px height

#### Color

This is the color of the progress part of the bar. It can be any value accepted as valid CSS, and can be changed dynamically in JavaScript.

#### Style

* Solid Color
* Animated Stripes

#### Position

* Regular Page Item
* Floating on Body

#### Show Percentage

* None
* On Bar
* Under Bar

#### Show Message

* None
* On Bar
* Under Bar

#### Options

* Hidden by default

### Control

As this plug-in implements the apex.item interface, you can use the following methods:

```javascript
// Setter Method. Here we set the value to 20% and change the info message, in a 1 second animation
apex.item('P20_PROGRESS_BAR').setValue('20:Loading...:1000');

// Getter Method. This will return "20:Loading...". The animation duration is never included.
var value = apex.item('P20_PROGRESS_BAR').getValue();

// Show/Hide Methods
apex.item('P20_PROGRESS_BAR').show();
apex.item('P20_PROGRESS_BAR').hide();
```

For even more control we can use the methods returned by apexProgressBar(itemName)

```javascript
/* The most important method here is the setValues method.
 * You can provide this method with 2 objects. The values, and the options objects 
 * The values object can contain the elements "percentage", "message", "color" and "duration".
 * The options object so far only contains the element "immediate", which defaults to false.
 */

// This is the same as the above setValue call
apexProgressBar('P20_PROGRESS_BAR').setValues({percentage: 20, message: "Loading...", duration: 1000});

// What we can also do is only change one of these values at a time. The other values are left the same.
apexProgressBar('P20_PROGRESS_BAR').setValues({message: "Loading..."});

// As opposed to the setValue function or dynamic action, this function also allows us to change the color of the progress bar
apexProgressBar('P20_PROGRESS_BAR').setValues({color: "red", duration: 100});    //could be helpful when showing an error

// Remember, successive calls to setValue(s) land the animations in a queue.
// To clear the queue and perform the setValues call immediately, use:
apexProgressBar('P20_PROGRESS_BAR').setValues({percentage: 40}, {immediate: true});

// More specific getter methods
var percentage = apexProgressBar('P20_PROGRESS_BAR').getPercentage();
var message    = apexProgressBar('P20_PROGRESS_BAR').getMessage();
var color      = apexProgressBar('P20_PROGRESS_BAR').getColor();

// To control the animation queue, we can use the following:
apexProgressBar('P20_PROGRESS_BAR').finish(); //goes immediately to the latest state of the queue
apexProgressBar('P20_PROGRESS_BAR').stop();   //stops the animation and empties the queue
```

### Known Issues

* The animation pauses when changing tabs.

### Changelog

2019-06-23 v1.0 initial release

### License

MIT
