import {Page, NavParams, ViewController, Platform} from 'ionic-angular';
import {ViewChild, Component} from '@angular/core';

//Components
import {SilverNeedleChart} from '../../components/chart/chart.component';

@Component({
    templateUrl: "build/pages/fgen-modal/fgen-modal.html",
    directives: [SilverNeedleChart]
})
export class ModalFgenPage {
    @ViewChild('chart') chart: SilverNeedleChart;
    private platform: Platform;
    private viewCtrl: ViewController;
    private params: NavParams;
    private waveType: string;
    private frequency: string;
    private amplitude: string;
    private offset: string;
    private dutyCycle: string;
    private newChart: any;
    private numPoints: number;
    
    public value: number;
    
    constructor(
        _platform: Platform,
        _viewCtrl: ViewController,
        _params: NavParams
    ) {
        this.platform = _platform;
        this.viewCtrl = _viewCtrl;
        this.params = _params;
        this.value = this.params.get('value');
        this.waveType = this.params.get('waveType');
        this.frequency = this.params.get('frequency');
        this.amplitude = this.params.get('amplitude');
        this.offset = this.params.get('offset');
        this.dutyCycle = this.params.get('dutyCycle');
        this.numPoints = 1000;
    }

    closeModal() {
        this.viewCtrl.dismiss({
            waveType: this.waveType,
            frequency: this.frequency,
            amplitude: this.amplitude,
            offset: this.offset,
            dutyCycle: this.dutyCycle
        });
    }
    
    isSquare() {
        if (this.waveType === 'square') {
            return true;
        }
        return false;
    }
    
    isDc() {
        if (this.waveType === 'dc') {
            return true;
        }
        return false;
    }
    
    saveInstance(chart: Object) {
        //not actually using right now
        this.newChart = chart;
        this.chart.clearSeries();
        this.drawWave();
        this.chart.redrawChart();
    }
    
    onSegmentChanged(event) {
        this.drawWave();
    }
    
    drawWave() {
        if (this.waveType === 'sine') {this.drawSine();}
        else if (this.waveType === 'ramp-up') {this.drawRampUp();}
        else if (this.waveType === 'square') {this.drawSquare();}
        else if (this.waveType === 'dc') {this.drawDc();}
        else if (this.waveType === 'triangle') {this.drawTriangle();}
        else if (this.waveType === 'ramp-down') {this.drawRampDown();}
        else {alert('wavetype not supported yet');}
    }
    
    drawSine() {
        //incomplete: need to set up point interval for x axis
        let waveform = {
            y: [],
            t0: 0,
            dt: 1
        };
        let period = 0;
        if (parseFloat(this.frequency) != 0) {
            period = 1 / parseFloat(this.frequency);
        }
        let dt = (2 * period) / this.numPoints;
        waveform.dt = dt;
        for (let i = 0; i < this.numPoints; i++) {
            waveform.y[i] = parseFloat(this.amplitude) * Math.sin(((Math.PI * 2) / (this.numPoints / 2)) * i) + parseFloat(this.offset);
        }
        this.chart.drawWaveform(0, waveform);
    }
    
    drawRampUp() {
        let waveform = {
            y: [],
            t0: 0,
            dt: 1
        };
        let period = 0;
        if (parseFloat(this.frequency) != 0) {
            period = 1 / parseFloat(this.frequency);
        }
        let dt = (2 * period) / this.numPoints;
        waveform.dt = dt;
        for (let i = 0; i < this.numPoints; i++) {
            waveform.y[i] = (i % (this.numPoints / 2)) * (parseFloat(this.amplitude) / (this.numPoints / 2)) + 
            parseFloat(this.offset);
        }
        this.chart.drawWaveform(0, waveform);
    }
    
    drawDc() {
        let waveform = {
            y: [],
            t0: 0,
            dt: 1
        };
        waveform.dt = 1;
        for (let i = 0; i < this.numPoints; i++) {
            waveform.y[i] = parseFloat(this.offset);
        }
        this.chart.drawWaveform(0, waveform);
    }
    
    drawTriangle() {
        let waveform = {
            y: [],
            t0: 0,
            dt: 1
        };
        let period = 0;
        if (parseFloat(this.frequency) != 0) {
            period = 1 / parseFloat(this.frequency);
        }
        let dt = (2 * period) / this.numPoints;
        waveform.dt = dt;
        for (let i = 0; i < (this.numPoints / 8); i++) {
            waveform.y[i] = ((parseFloat(this.amplitude) / (this.numPoints / 8)) * i) + parseFloat(this.offset);
        }
        for (let i = 0; i < (this.numPoints / 4); i++) {
            waveform.y[i + (this.numPoints / 8)] = parseFloat(this.amplitude) + parseFloat(this.offset) - 
            ((parseFloat(this.amplitude) / (this.numPoints / 4)) * 2 * i);
        }
        for (let i = 0; i < (this.numPoints / 8); i++) {
            waveform.y[i + (this.numPoints * 3 / 8)] = waveform.y[i] - parseFloat(this.amplitude);
        }
        for (let i = 0; i < (this.numPoints / 2); i++) {
            waveform.y[i + this.numPoints / 2] = (waveform.y[i]);
        }
        this.chart.drawWaveform(0, waveform);
    }
    
    drawRampDown() {
        let waveform = {
            y: [],
            t0: 0,
            dt: 1
        };
        let period = 0;
        if (parseFloat(this.frequency) != 0) {
            period = 1 / parseFloat(this.frequency);
        }
        let dt = (2 * period) / this.numPoints;
        waveform.dt = dt;
        for (let i = 0; i < this.numPoints; i++) {
            waveform.y[i] = ((-1 * i) % (this.numPoints / 2)) * (parseFloat(this.amplitude) / (this.numPoints / 2)) + 
            parseFloat(this.amplitude) + parseFloat(this.offset);
        }
        this.chart.drawWaveform(0, waveform);
    }
    
    drawNoise() {
        let waveform: number[] = [];
    }
    
    drawTrap() {
        let waveform: number[] = [];
    }
    
    drawSinPow() {
        let waveform: number[] = [];
    }
    
    drawSquare() {
        let waveform = {
            y: [],
            t0: 0,
            dt: 1
        };
        let period = 0;
        if (parseFloat(this.frequency) != 0) {
            period = 1 / parseFloat(this.frequency);
        }
        let dt = (2 * period) / this.numPoints;
        waveform.dt = dt;
        let i = 0;
        for (i = 0; i < (this.numPoints / 2) * (parseFloat(this.dutyCycle) / 100); i++) {
            waveform.y[i] = parseFloat(this.offset) + parseFloat(this.amplitude);
        }
        for (; i < (this.numPoints / 2); i++) {
            waveform.y[i] = parseFloat(this.offset) - parseFloat(this.amplitude);
        }
        for (let j = 0; i < this.numPoints; i++, j++) {
            waveform.y[i] = waveform.y[j];
        }
        this.chart.drawWaveform(0, waveform);
    }
}