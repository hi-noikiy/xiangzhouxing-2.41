"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// pages/g-radio-group/index.js
const formCheckBehavior = require("../behaviors/formCheck");
const formControllerBehavior = require("../behaviors/formController");
Component({
    behaviors: [formCheckBehavior, formControllerBehavior],
    relations: {
        '../g-form/index': {
            type: 'ancestor'
        }
    },
});
