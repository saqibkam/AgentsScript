// ==UserScript==
// @name         WASSI Monitoring
// @namespace    http://tampermonkey.net/
// @version      2024-02-06
// @description  try to take over the world!
// @author       You
// @match        https://wassi.sigmadialer.com/vicidial/realtime_report.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function () {
    'use strict';


    let onlineAgents = [];
    let offlineAgents = [];

    let myAgents = [6000, 6001,6002, 6003, 6004, 6005, 6006, 6007,6008, 6009, 6010, 6011, 6012, 6013, 6014, 6015, 6016, 6017, 6018, 6019, 6020, 6021, 6022, 6023, 6024, 6025, 6026, 6027, 6028, 6029, 6030]
    let restrictedColors = ["violet", "yellow"]

    const baseUrl = "https://wassi.sigmadialer.com/vicidial/";
    // Function to check and collect the elements
    function checkAndCollectIds() {
        checkOnlineAgents();
        findOfflineAgents();

        console.log("\nOnlineAgents:")
        console.log(onlineAgents);
    }


    setInterval(checkAndCollectIds, 10000);

    function findOfflineAgents() {
        const elementsNotInArray2 = myAgents.filter((element) => !onlineAgents.includes(element));
        let display = document.querySelector("body > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3) > a:nth-child(1)")
        display.innerText = elementsNotInArray2;
        display.style.color = "white";
        display.style.fontSize = 75;
    }

    function checkOnlineAgents() {
        let total_ids = document.querySelector("#realtime_content > b:nth-child(8) > font:nth-child(1)").innerText;
        let i = 5;
        onlineAgents = [];
        for (let a = 0; a < total_ids; a++) {
            ///html/body/table[2]/tbody/tr/td/form/span[2]/pre/font/a[9]/span/b
            const xpath = `/html/body/table[2]/tbody/tr/td/form/span[2]/pre/font/a[${i}]/span`;
            const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            i = i + 2;
            console.log("elements: ", element);
            if (element) {
                let agentId = parseInt(element.innerText);
                onlineAgents.push(agentId);
                if (myAgents.includes(agentId)) {
                    findAgentColor(xpath);
                }
            } else {
                console.log("Element not found");
            }
        }
    }

    function findAgentColor(agent) {
        //const parentXPath = "/html/body/table[2]/tbody/tr/td/form/span[2]/pre/font/a[7]/span";
        const parentElement = document.evaluate(agent, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (parentElement) {
            const parentClassName = parentElement.className;
            //if parentClassname is in restricted colors, open the agent
            if (restrictedColors.includes(parentClassName)) {
                const modified_agent = agent.replace(/\/span$/, '');

                const element = document.evaluate(modified_agent, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

                if (element) {
                    const href = element.getAttribute("href");
                    if (href) {
                        const fullUrl = baseUrl + href;
                        window.open(fullUrl, '_blank');
                    } else {
                        console.log("Link attribute not found");
                    }
                }
                console.log("Need to kick: ", parentElement);
            }
        } else {
            console.log("Element not found");
        }
    }

})();
