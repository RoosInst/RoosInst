

$(function() {

    $('#TIMs').magicSuggest({
  placeholder: 'Enter TIM Model...',
  valueField: 'model',

  resultAsString: true,
  data: [
    {
        "model": "RI7725C",
        "name": "Source - 20 GHz Microwave Signal Generator",
        "category": "Signal Generators",
        "specs": "20 GHz"
    },
    {
        "model": "RI8535A",
        "name": "FSPU Digital TIM (40/80/120)",
        "category": "DC & Digital I/O",
        "specs": "Up to 120 Pins"
    },
    {
        "model": "RI8545B",
        "name": "Testset - 4 ports, 20 GHz Test Head",
        "category": "RF Measurement",
        "specs": "4x 20 GHz"
    },
    {
        "model": "RI8546C",
        "name": "Device Power Module (DP,VM,DB,VI,VCC)",
        "category": "DC & Digital I/O",
        "specs": "DC"
    },
    {
        "model": "RI8563C",
        "name": "Testset - 2 Port 1-Path, 4-40.5 GHz",
        "category": "RF Measurement",
        "specs": "2x 40 GHz"
    },
    {
        "model": "RI8564B",
        "name": "Testset - 1 Port, 75-81 GHz WR-12 TIM",
        "category": "RF Measurement",
        "specs": "71-86 GHz"
    },
    {
        "model": "RI8565A",
        "name": "Testset - 4 Ports, 20 GHz with Pulse",
        "category": "RF Measurement",
        "specs": "20 GHz with Pulse"
    },
    {
        "model": "RI8567A",
        "name": "Testset and RF Measure - 2 Port, 6 GHz TIM",
        "category": "RF Measurement",
        "specs": "6 GHz"
    },
    {
        "model": "RI8567B",
        "name": "Testset and RF Measure - 2 Port, 12 GHz TIM",
        "category": "RF Measurement",
        "specs": "12 GHz"
    },
    {
        "model": "RI8572A",
        "name": "Time Domain Measurement (HP Waveform)",
        "category": "Signal Generators",
        "specs": "Waveform"
    },
    {
        "model": "RI8573A",
        "name": "Testset - 1 Port, 50-58 GHz WR-15 TIM",
        "category": "RF Measurement",
        "specs": "50-58 GHz"
    },
    {
        "model": "RI8574A",
        "name": "EPC, Cassini 16 System Controller TIM",
        "category": "Infrastructure",
        "specs": "MultiCore SSD"
    },
    {
        "model": "RI8575A",
        "name": "Phase Noise Measure",
        "category": "RF Measurement",
        "specs": "8 GHz"
    },
    {
        "model": "RI8577A",
        "name": "2 Source Combiner with Amp/Attenuator",
        "category": "Signal Generators",
        "specs": "20 GHz"
    },
    {
        "model": "RI8580A",
        "name": "Testset - 1 Port, 59-67 GHz WR-15 TIM",
        "category": "RF Measurement",
        "specs": "59-67 GHz"
    },
    {
        "model": "RI8581A",
        "name": "RF Measure - 20 GHz Receiver TIM, non-DSP (Req.LO)",
        "category": "RF Measurement",
        "specs": "Receiver"
    },
    {
        "model": "RI8582A",
        "name": "Testset - 2 Port 1-Path, 4-40.5 GHz, w/ NF",
        "category": "RF Measurement",
        "specs": "2x 4-40 GHz"
    },
    {
        "model": "RI8586A",
        "name": "Source - 20 GHz Microwave Signal Generator",
        "category": "Signal Generators",
        "specs": "20 GHz"
    },
    {
        "model": "RI8587A",
        "name": "RF Measure - 20 GHz Receiver w/ DSP TIM (Req. LO)",
        "category": "RF Measurement",
        "specs": "Receiver + DSP"
    },
    {
        "model": "RI8589B",
        "name": "FET Pulser TIM",
        "category": "DC & Digital I/O",
        "specs": "High Power"
    },
    {
        "model": "RI8594A",
        "name": "Time Domain Meas. (HP Waveform) + Low Noise Clk",
        "category": "Signal Generators",
        "specs": "Waveform + LNC"
    },
    {
        "model": "RI8595A",
        "name": "Power Amplifier TIM, 0.7-2.7GHz, 30W Nominal",
        "category": "Signal Generators",
        "specs": "30W Nominal 0.7-2.7GHz"
    }
],
  
  renderer: function(data){
      return '<div style="padding: 5px; overflow:hidden;">' +
          '<div style="float: left; margin-left: 5px">' +
              '<div style="font-weight: bold; color: #333; font-size: 10px; line-height: 11px">' + data.model + '</div>' +
              '<div style="color: #999; font-size: 9px">' + data.name + '</div>' +
          '</div>' +
      '</div><div style="clear:both;"></div>'; // make sure we have closed our dom stuff
  }
    });
});
