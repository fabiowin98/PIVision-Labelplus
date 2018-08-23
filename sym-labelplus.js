/*
 OSI PI - PI Vision Extensibility Course - Final Project
 
 author: Fabio Degl'Innocenti
 username: fabio.deglinnocenti@ersistemi.it
 company: ERsistemi s.r.l.
 country: Italy

 symbol: labelplus, a Twitter's Bootstrap-powered custom symbol
 functionalities:
 the symbol is another type of label, used to show the value of a PI tag. The label can be 
 animated based on specific values, the graphics of the symbol is based on the Bootstrap 3 CSS
 framework. The symbol has a configuration panel used to configure the label appearance.
 the logic is that it is possible to set a warning and a critical limit of the PI tag:
 there are 2 warning limits (high and low) and 2 critical limits (high and low), when the value
 goes up to the high limit (or below the low limit) the label color changes (yellow for warning,
 red for critical). It is also possible to configure a blinking effect when critical is active. 
 
*/
(function (PV) {
	"use strict";

	function symbolVis() { };
	PV.deriveVisualizationFromBase(symbolVis);

	var definition = { 
		typeName: "labelplus",
		visObjectType: symbolVis,
		iconUrl: "./Scripts/app/editor/symbols/ext/sym-labelplus.png",
		datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
		noExpandSelector: ".noExpandSelector",		//this attribute is used to not show the chart by performing a double click on the symbol
		getDefaultConfig: function(){ 
			return { 
				Height: 50,
				Width: 150,
				label: {
					show: true,
					color: "white",
					background: "transparent"
				},
				showUnits: true,		//this flag enables the engineering unit visualization
				warning: {
					enabled: false,		//this flag enables the warning limits
					high: 60,
					low: 40
				},
				critical: {
					enabled: false,		//this flag enables the critical limits
					high: 80,
					low: 20
				},
				blinking: {
					enabled: false,		//this flag enables the blinking effect
					value: true		//this value is used for the blinking effect
				},
				isNaN: function(input){		//this function is used for the validation of the warning/critical limits
					if(!input)return true;
					return isNaN(input);
				},
				italianworkaround: false	//this is necessary for it-it numbering format (maybe somewhere else in the world?)
			} 
		},
		configOptions: function (context, clickedElement) {
			//the first context menu item shows the configuration panel
			//the second context menu item shows an about popup
			var options = [{
					title: "Configure",
					mode: "format"
				}
				, {
					title: "About",
					action: function(){
						 alert("LabelPlus - PI Vision Extension Symbol\nauthor: Fabio Degl'Innocenti, ERsistemi s.r.l. (Italy)");
					}
				}, 				 "separator" 
			];
			return options;
		}
	}

	symbolVis.prototype.init = function(scope, elem) {

		//initialization of the scope.labelplus object
		scope.labelplus = {};

		//handling the onDataUpdate event
		this.onDataUpdate = dataUpdate;		
		function dataUpdate(data){
			if(!data)return;
			
			//every 5 seconds the value is updated
			scope.labelplus.value = formatNumber(data.Value);

			//by default, critical and warning limits are disabled
			scope.labelplus.warning = false;
			scope.labelplus.critical = false;
			//check if the blinking effect is enabled, if not the value is TRUE
			if(scope.config.blinking.enabled){
				scope.config.blinking.value = !scope.config.blinking.value;
			}else{
				scope.config.blinking.value = true;
			}
			//warning limits logic
			if(scope.config.warning.enabled){
				if(!scope.config.isNaN(scope.config.warning.high) && scope.labelplus.value>scope.config.warning.high){
					scope.labelplus.warning = true;
				}
				if(!scope.config.isNaN(scope.config.warning.low) && scope.labelplus.value<scope.config.warning.low){
					scope.labelplus.warning = true;
				}
			}
			//critical limits logic
			if(scope.config.critical.enabled){
				if(!scope.config.isNaN(scope.config.critical.high) && scope.labelplus.value>scope.config.critical.high){
					scope.labelplus.critical = true && scope.config.blinking.value;
				}
				if(!scope.config.isNaN(scope.config.critical.low) && scope.labelplus.value<scope.config.critical.low){
					scope.labelplus.critical = true && scope.config.blinking.value;
				}
			}
			//slow update: the engineering unit and the label name is loaded.
			if(data.Label){
				scope.labelplus.label = data.Label;
				scope.labelplus.units = data.Units;
				if(!scope.labelplus.units){
					scope.config.showUnits = false;
				}
			}
			//in case of PI errors (i.e. stop of the PI services during the visualization of the display)
			if(data.ErrorDescription){
				scope.labelplus.error = "(" + data.ErrorCode + ") " + data.ErrorDescription;
			}
		}

		//this function converts non-american numbers in correct floating point values
		function formatNumber(input){
			if(scope.config.italianworkaround){
				var normalizedInput = input.replace(",",".");
				return parseFloat(normalizedInput);
			}else{ return input; }
		}
	};

	PV.symbolCatalog.register(definition); 
})(window.PIVisualization); 
