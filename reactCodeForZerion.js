/* eslint-disable no-eval */

import React from "react";
import { Pie } from "react-chartjs-2";

var urlData = "";

class PieChartHandler extends React.Component {

    constructor(props) {
        super(props);
        this.jsonFile = require(this.props.jsonFile);
        this.retrieveURLData(this.jsonFile.datasource);
    }

    calculateCount(srchVar, operator, srchStr) {
        var count = 0;
        var rootobj = this.jsonFile.rootobj ? "." + this.jsonFile.rootobj : "";
        var objToMap = eval('urlData' + rootobj);
        objToMap.map(entry => {
            if (eval("entry." + srchVar + operator + "'" + srchStr + "'")) count++;
        });
        return count;
    }

    parseOperation(datasetStr) {
        var operationName = datasetStr.substring(datasetStr.indexOf('@') + 1, datasetStr.indexOf('('));
        var variableName = datasetStr.substring(datasetStr.indexOf('(') + 1, datasetStr.indexOf(')'));
        var tmpIdx = 0;
        var tmpStr = "";
        var operator = "";
        var valStr = "";

        if (operationName === "COUNT") {
            tmpIdx = datasetStr.indexOf(')') + 1;
            operator = (datasetStr.substring(tmpIdx, datasetStr.indexOf(' ', tmpIdx + 1))).trim();
            tmpStr = datasetStr.substring(datasetStr.indexOf('"') + 1);
            valStr = tmpStr.substring(0, tmpStr.indexOf('"'));
            return this.calculateCount(variableName, operator, valStr);
        }
    }

    handleStringReplacements() {
        var i = 0;
        var numOfDataSets = this.jsonFile.datasets.length;
        var newdataGroup = [];
        var result = 0;

        for (i = 0; i < numOfDataSets; i++) {
            var dataGroups = this.jsonFile.datasets[i].data;
            for (var y = 0; y < dataGroups.length; y++) {
                var datasetStr = JSON.stringify(dataGroups[y]);
                if (datasetStr.indexOf('@') > 0) {
                    result = this.parseOperation(datasetStr, i, y);
                    newdataGroup.push(result);
                }
            }
            this.jsonFile.datasets[i].data = eval("[" + newdataGroup + "]");
            newdataGroup = [];
        }
    }

    retrieveURLData(sourceURL) {
        new Promise(resolve => fetch(sourceURL, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(response => {
            urlData = response;
            this.handleStringReplacements();
        }))
    }

    render() {
        return (
            <div>
                <h1>{this.jsonFile.title}</h1>
                <Pie data={this.jsonFile} />
            </div>
        );
    }
}

export default PieChartHandler;
