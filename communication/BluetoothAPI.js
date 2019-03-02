import BleService from './BleService';

class BluetoothAPI {

    start_route(instructions, duration = instructions.length, interval = 1){
        BleService.sendCommandToActDevice('D'+String(duration));
        BleService.sendCommandToActDevice('I'+String(interval));
        BleService.sendCommandToActDevice('E');
        instructions.forEach(function(entry) {BleService.sendCommandToActDevice(entry[0]+','+entry[1])});
        BleService.sendCommandToActDevice('R');
    }

    stop(){
        BleService.sendCommandToActDevice('S');
    }

    learn_mode(){
        BleService.sendCommandToActDevice('L');
    }



}