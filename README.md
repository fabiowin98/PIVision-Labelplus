# PIVision-Labelplus
PI Vision custom symbol as final project for the PI Vision Extensibility course

My custom symbol is called "Labelplus" is a Single tag PI vision symbol that shows the current value of a tag, the HTML component is highlighted based on some configured conditions. 

The graphical appearance is build with the (twitter's) Bootstrap CSS framework (all the files are available in the libraries folder).

The functionalities of the symbol are the following:

 * Show the PI tag current vlaue with a configurable number of digits
 * Show/hide the PI tag engineering unit
 * Show/hide the PI tag label
 * Enable the "Warning" limit: based on configuration it is possible to specify an high limit and a low limit. If the warning limit is enabled, when the value of the tag goes upper the high limit or lower the low limit the symbol becomes yellow.
 * Enable the "Critical" limit: based on configuration it is possible to specify an high limit and a low limit. If the critical limit is enabled, when the value of the tag goes upper the high limit or lower the low limit the symbol becomes red.
 * Enable the "Blinking" effect: If the blinking effect is enabled, when the critical limits are overpassed the red coloring starts blinking
 * In case of errors during the communication between PI Vision and the PI Server (for example, the shutdown of the PI services in the PI server) an error label is shown.


How to install the symbol:
 1. copy all the files in the \PIPC\PIVision\Scripts\app\editor\symbols\ext folder
 2. copy all the files in the library folder in the \PIPC\PIVision\Scripts\app\editor\symbols\ext\libraries folder
 3. restart the IIS Service where the PI Vision is hosted (to load the external libraries)
