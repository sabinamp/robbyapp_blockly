import BleService from '../communication/BleService'
import { throwStatement } from '@babel/types';

class RobotProxy {
    constructor() {
        isConnected = false;
    }

    setRobot(robotDevice) {
        if (! this.isConnected) {
            BleService.setActDevice(robotDevice);
        }
    }

    scanningForRobots(errorHandler, deviceHandler) {
        if (! this.isConnected) {
            BleService.scanningForRobots(errorHandler, deviceHandler)
        }
    }

    connect(responseHandler, connectionHandler, errorHandler) {
        BleService.connectToActDevice(
            (response) => {
                const res = this.prepareResponse(response);
                responseHandler(res);
            },
            (robot) => {
                this.isConnected = true;
                connectionHandler(robot);
            },
            errorHandler);
    }

    disconnect() {
        if (this.isConnected) {
            BleService.shutdown();
            this.isConnected = false;
        } else {
            console.log("Warning: robot already disconnected!")
        }
    }

    run() {
        if (this.isConnected) {
            BleService.sendCommandToActDevice('R');
        }
    }

    // Starts robot
    go() {
        if (this.isConnected) {
            BleService.sendCommandToActDevice('G');
        }
    }

    // Stops robot
    stop() {
        if (this.isConnected) {
            BleService.sendCommandToActDevice('S');
        }
    }

    record(loops) {
        if (this.isConnected) {
            this.is_learning = true;
            BleService.sendCommandToActDevice('F');
            BleService.sendCommandToActDevice('D' + loops);
            BleService.sendCommandToActDevice('L');
        }
    }

    speed_padding(speed) {
        if (speed !== 0)
            speed = parseInt(speed * 2.55 + 0.5);
        speed = String(speed);
        while (speed.length < 3) { speed = "0" + speed; }
        return speed
    }

    // Uploads speed entries from the app to the robot
    upload(speeds) {
        if (this.isConnected) {
            BleService.sendCommandToActDevice('F');
            BleService.sendCommandToActDevice('D' + speeds.length);
            BleService.sendCommandToActDevice('I1');
            BleService.sendCommandToActDevice('E');
            for (let i = 0; i < speeds.length; i++) {
                let item = speeds[i];
                let speed = this.speed_padding(item.left) + ',' + this.speed_padding(item.right) + 'xx';
                BleService.sendCommandToActDevice(speed);
            }
            BleService.sendCommandToActDevice(',,,,');
        }
    }

    // Downloads speed entries from the robot to the app
    download() {
        if (this.isConnected) {
            BleService.sendCommandToActDevice('B');
        }
    }

    // handles responses from the robot
    prepareResponse(response) {
        console.log("Response: " + response)
        if (response.match("\\b[0-9]{3}\\b,\\b[0-9]{3}\\b")) {
            let read_speeds = response.trim().split(',');
            let speed_l = read_speeds[0] / 2.55 + 0.5;
            let speed_r = read_speeds[1] / 2.55 + 0.5;
            if (speed_l < 0)
                speed_l = 0;
            if (speed_r < 0)
                speed_r = 0;
            var res = {type: 'speedLine', left: speed_l, right: speed_r}
            console.log(res)
            return res 
        } else {
            response = response.trim().toLowerCase() 
            switch (response) {     
                case (',,,,'): 
                    // finished beam
                    var res = {type: 'finishedBeam'}
                    console.log(res)
                    return res           
                case ('_sr_'): 
                    // stop
                    var res = {type: 'stop'}
                    this.is_learning = false
                    console.log(res)
                    return res           
                case ('full'): 
                    // done learning
                    var res = {type: 'learningCheck'}
                    console.log(res)
                    return res          
                case ('_end'): 
                    // done driving
                    var res = {type: 'finishedDriving'}
                    console.log(res)
                    return res              
                default:
                    var res = {type: response}
                    console.log(res)
                    return res   
            }   
        }    
    }   
}

// Singleton pattern in ES6
export default new RobotProxy();