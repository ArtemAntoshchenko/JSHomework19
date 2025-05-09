class Vehicle {
    constructor(brand, model, year) {
        this.brand = brand
        this.model = model
        this.year = year
        this.speed = 0
        this.engine = false
    }

    startEngine() {
        throw new Error("Метод должен быть в подклассе");
    }

    stopEngine() {
        this.engine = false;
        console.log(`${this.getInfo()} двигатель выключен`)
    }

    acceleration(amount) {
        if (!this.engine) {
            console.log("Сначала запустите двигатель");
            return;
        }
        this.speed += amount;
        console.log(`${this.getInfo()} ускоряется до ${this.speed} км/ч`)
    }

    brake(amount) {
        this.speed = Math.max(0, this.speed - amount);
        console.log(`${this.getInfo()} замедляется до ${this.speed} км/ч`)
    }

    getInfo() {
        return `${this.brand} ${this.model} ${this.year}`
    }

    honk(){
        console.log("Автомобиль бибикает")
    }
}

class GasolineCar extends Vehicle {
    constructor(brand, model, year, fuelCapacity) {
        super(brand, model, year);
        this.fuelCapacity = fuelCapacity; 
        this.currentFuel = fuelCapacity; 
    }

    startEngine() {
        if (this.currentFuel <= 0) {
            console.log("Нет топлива! Едь на росНефть");
            return false;
        }
        this.engine = true;
        console.log(`${this.getInfo()} двигатель запущен (бензин)`);
        return true;
    }

    refuel(liters) {
        this.currentFuel = Math.min(this.fuelCapacity, this.currentFuel + liters); 
        console.log(`Заправлено. Топлива ${this.currentFuel} литров. ${this.fuelCapacity}`)
    }

    acceleration(amount) {
        if (!this.startEngine()) return; 
        let fuelConsumption = amount * 0.1; 
        if (this.currentFuel < fuelConsumption) {
            console.log("Недостаточно топлива")
            return;
        }
        this.currentFuel -= fuelConsumption;
        super.acceleration(amount);
        console.log(`Остаток топлива ${this.currentFuel.toFixed(1)}литра`)
    }

    honk(){
        console.log("Автомобиль на бензине бибикает")
    }
}

class ElecrticCar extends Vehicle {
    constructor(brand, model, year, batteryCapacity) {
        super(brand, model, year);
        this.batteryCapacity = batteryCapacity 
        this.currentCharge = batteryCapacity 
    }

    // Полиморфизм, переопределяем метод запуска двигателя для электромобиля
    startEngine() {
        if (this.currentCharge <= 0) {
            console.log("Батарея разряжена")
            return false;
        }
        this.engine = true;
        console.log(`${this.getInfo()} двигатель запущен`)
        return true;
    }

    charge(kwh) {
        this.currentCharge = Math.min(this.batteryCapacity, this.currentCharge + kwh);
        console.log(`Заряжено. Батарея: ${this.currentCharge.toFixed(1)} кВт * ч. из ${this.batteryCapacity} кВч`);

    }

    // Полиморфизм переопределяем ускорение с учетом расхода энергии.
    acceleration(amount) {
        if (!this.startEngine()) return; 
        let energyConsumption = amount * 0.05 
        if (this.currentCharge < energyConsumption) {
            console.log("Недостаточно заряда, едь на станцию")
            return;
        }
        this.currentCharge -= energyConsumption;
        super.acceleration(amount);
        console.log(`Остаток заряда: ${this.currentCharge.toFixed(1)} кВт Ч.`)
    }

    honk(){
        console.log("Автомобиль на электричестве бибикает")
    }
}

class HybridCar extends GasolineCar {
    constructor(brand, model, year, fuelCapacity, batteryCapacity) {
        super(brand, model, year, fuelCapacity);
        this.batteryCapacity = batteryCapacity;
        this.currentCharge = batteryCapacity;
        this.electricMode = false;
    }

    startEngine() {
        if (this.currentCharge > 0) {
            this.engine = true;
            this.electricMode = true;
            console.log(`${this.getInfo()} двигатель запущен (электрический режим)`);
            return true;
        }

        else if (this.currentFuel > 0) {
            this.engine = true;
            this.electricMode = false;
            console.log(`${this.getInfo()} двигатель запущен (бензиновый режим)`)
            return true;
        }
        console.log("Нет заряда и топлива")
        return false;
    }

    // Полиморфизм. Переопределяем ускорение для гибрида
    acceleration(amount) {
        if (this.electricMode) { 
            let energyConsumption = amount * 0.04
            if (this.currentCharge < energyConsumption) {
                console.log(`Переключаемся на бензин`);
                this.electricMode = false;
                if (this.currentFuel <= 0) {
                    console.log("Бензин закончился");
                    return;
                }
            } else {
                this.currentCharge -= energyConsumption;
                super.acceleration(amount);
                console.log(`(Электро) остаток заряда: ${this.currentCharge.toFixed(1)} кВт Ч.`);
                return;
            }
        }
        
        let fuelConsumption = amount * 0.1; 
        if (this.currentFuel <= 0) {
            console.log("Бензин закончился");
            return;
        }
        this.currentFuel -= fuelConsumption;
        super.acceleration(amount);
        console.log(`(Бензин) Остаток топлива ${this.currentFuel.toFixed(1)} литров.`)
    }

    honk(){
        console.log("Автомобиль бибикает?")
    }
}

class DieselCar extends Vehicle{
    constructor(brand, model, year, fuelCapacity, season) {
        super(brand, model, year);
        this.fuelCapacity = fuelCapacity; 
        this.currentFuel = fuelCapacity;
        this.season = season;
        this.typeOfDiesel = 'SummerType'
    }

    startEngine() {
        if (this.currentFuel <= 0) {
            console.log("Нет топлива! Едь на росНефть");
            return false;
        }
        if (this.season == 'winter' && this.typeOfDiesel == 'SummerType'){
            console.log('Сейчас зима! Замени дизель на зимний, иначе не запущусь!');
            return false;
        }
        this.engine = true;
        console.log(`${this.getInfo()} двигатель запущен (дизель)`);
        return true;
    }

    switchDieselType(){
        this.typeOfDiesel='WinterType'
        console.log(`Залили ${this.typeOfDiesel} дизеля`)
    }

    refuel(liters) {
        this.currentFuel = Math.min(this.fuelCapacity, this.currentFuel + liters); 
        console.log(`Заправлено. Топлива ${this.currentFuel} литров. ${this.fuelCapacity}`)
    }

    acceleration(amount) {
        if (!this.startEngine()) return; 
        let fuelConsumption = amount * 0.1; 
        if (this.currentFuel < fuelConsumption) {
            console.log("Недостаточно топлива")
            return;
        }
        this.currentFuel -= fuelConsumption;
        super.acceleration(amount);
        console.log(`Остаток топлива ${this.currentFuel.toFixed(1)}литра`)
    }

    getInfo() {
        return `${this.brand} ${this.model} ${this.year} ${this.typeOfDiesel}`
    }

    honk(){
        console.log("Автомобиль на дизеле бибикает")
    }
}


function testDrive(vehicle) {
    console.log('Тест драйв для:', vehicle.getInfo())
    vehicle.startEngine();
    vehicle.acceleration(20);
    vehicle.acceleration(30);
    vehicle.brake(15);
    vehicle.honk();
    vehicle.acceleration(25);
    vehicle.startEngine();
}

function testDrive1(vehicle) {
    console.log('Тест драйв для:', vehicle.getInfo())
    vehicle.switchDieselType();
    console.log(vehicle.getInfo());
    vehicle.startEngine();
    vehicle.acceleration(20);
    vehicle.acceleration(30);
    vehicle.brake(15);
    vehicle.acceleration(25);
    vehicle.startEngine();
}


let gasolineCar = new GasolineCar("Opel", "Zafira", 2007, 60)
let electricCar = new ElecrticCar("Tesla", "Model X",  2020, 75)
let hybridCar = new HybridCar("Toyota", "Prius", 2021, 45, 5)
let dieselCar = new DieselCar('LADA','VAZ-21215', 2020, 83, 'winter')

testDrive(gasolineCar)
testDrive(electricCar)
testDrive(hybridCar)
testDrive(dieselCar)
testDrive1(dieselCar)