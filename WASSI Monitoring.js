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

    const start = 6001;
    const end = 6030;

    const myAgents = Array.from({ length: end - start + 1 }, (_, index) => start + index);
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
    let total_ids = document.querySelector("#realtime_content > b:nth-child(9) > font:nth-child(1)").innerText;
    let onlineAgents = [];
    let selectedXPath = null;

    for (let i = 5; i <= total_ids; i += 2) {
        const xpath1 = `/html/body/table[2]/tbody/tr/td/form/span[2]/pre/font/a[${i}]/span`;
        const xpath2 = `/html/body/font[2]/font/font/table/tbody/tr/td/form/span[2]/pre/font/a[${i}]/span`;

        const element1 = document.evaluate(xpath1, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const element2 = document.evaluate(xpath2, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (element1 || element2) {
            selectedXPath = element1 ? xpath1 : xpath2;
            let agentId = parseInt(element1 ? element1.innerText : element2.innerText);
            onlineAgents.push(agentId);
            if (myAgents.includes(agentId)) {
                findAgentColor(selectedXPath);
            }
        } else {
            console.log(`Element not found for XPath 1: ${xpath1} and XPath 2: ${xpath2}`);
        }
    }

    console.log("Selected XPath:", selectedXPath);
    console.log("Online Agents:", onlineAgents);
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
