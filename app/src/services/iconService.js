class IconService{
	constructor(){
		// todo
	}
	getName(code){
		var name = {
			"01d":"wb_sunny",
			"02d":"filter_drama",
			"03d":"cloud",
			"04d":"cloud",
			"09d":"grain",
			"10d":"grain",
			"11d":"flash_on",
			"13d":"ac_unit",
			"01n":"wb_sunny",
			"02n":"filter_drama",
			"03n":"cloud",
			"04n":"cloud",
			"09n":"grain",
			"10n":"grain",
			"11n":"flash_on",
			"13n":"ac_unit"
		}
		return name[code]
	}
}

export default IconService;