// client-side js
// run by the browser each time your view template referencing it is loaded

(function() {
  "use strict";

  const basicKey = "basic";
  const orgInvolvedKey = "orgInvolved";
  const incTypeKey = "inctype";
  const locKey = "location";
  const infraInvolKey = "infraInvolved";
  const injuryKey = "injury";
  const descKey = "desc";
  const testsKey = "tests";

  var app = {
    postData: {},
    testData: {},
    testDataId: 100,
    incidentsForm: document.forms[0],

    //Form Sections
    secBasic: document
      .querySelector(".secBasic")
      .getElementsByClassName("row")[0],
    secInfra: document
      .querySelector(".secInfra")
      .getElementsByClassName("row")[0],
    secInjury: document
      .querySelector(".secInjury")
      .getElementsByClassName("row")[0],
    secTest: document
      .querySelector(".secTest")
      .getElementsByClassName("col")[0],

    //Incident Type
    incTypeA: document.getElementById("typeA"),

    //Location Selection Radio
    incLoc1: document.getElementById("Loc1"),
    incLoc2: document.getElementById("Loc2"),
    incLoc3: document.getElementById("Loc3"),
    incLoc4: document.getElementById("Loc4"),

    //Location Inputs
    incLocGrp1: document.getElementById("locGrp1"),
    incLocGrp2: document.getElementById("locGrp2"),
    incLocGrp3: document.getElementById("locGrp3"),
    incLocGrp4: document.getElementById("locGrp4"),

    chkBasic: document.getElementById("chkBasic"),

    //Infra Involved
    chkInfra: document.getElementById("chkInfra"),

    //Injury
    chkInj: document.getElementById("chkInj"),
    chkInjHosp: document.getElementById("chkInjHosp"),

    //Testing Details
    chkTest: document.getElementById("chkTest"),
    btnAddTest: document.getElementById("btnAddTest"),
    testDataInputs: document.getElementById("testDataInputs"),
    tableTest: document.getElementById("tableTest"),
    inctypeInput: document.forms[0].elements["incType"],

    //form Submission
    btnSubmitInc: document.getElementById("btnSubmitInc"),

    //show messages
    divMsg: document.querySelector(".message")
  };

  app.init = async function() {
    //hide secs
    app.chkBasic.checked = false;
    app.showElements([app.secBasic]);

    app.chkInfra.checked = false;
    app.showElements([app.secInfra]);

    app.chkInj.checked = false;
    app.showElements([app.secInjury]);

    app.chkTest.checked = false;
    app.showElements([app.secTest]);

    app.chkInjHosp.checked = false;

    //reset radio buttons
    app.incLoc1.checked = true;
    app.incTypeA.checked = true;

    //get the User Details
    //await getData(, app.currentUser);
    //Init PostData with default values

    app.postData[orgInvolvedKey] = {
      orgInfraValue: "",
      orgSPOperValue: "",
      orgSPMainValue: "",
      orgOthValue: ""
    };
    app.postData[incTypeKey] = {
      incType: "A",
      IncWeathValue: "",
      IncTimeValue: "",
      IncYourRefValue: ""
    };
    app.postData[locKey] = {
      locType: "Loc1",
      locValue1: "",
      locValue2: "",
      locValue3: "",
      locValue4: ""
    };
    app.postData[infraInvolKey] = {
      infraInvolChecked: false,
      infraInvolTrainValue: "",
      infraInvolRVNValue: "",
      infraInvolOtherValue: "",
      infraInvolDescValue: ""
    };
    app.postData[injuryKey] = {
      injuryChecked: false,
      injuredSelected: "PAS",
      injSeverValue: "",
      injHospAdmChecked: false
    };
    app.postData[testsKey] = { testChecked: false };
    app.postData[descKey] = { descValue1: "", descValue2: "", descValue3: "" };

    app.currentUser = await getData("/user/info");

    //user details should come from logged in user in the Server

    //console.log(app.currentUser)
    //Display the Currest User Details
    app.secBasic.children[0].children[1].value = app.currentUser.ORG_NAME;
    app.secBasic.children[1].children[1].value = app.currentUser.UNAME;
    app.secBasic.children[2].children[1].value = app.currentUser.UTITLE;
    app.secBasic.children[3].children[1].value = app.currentUser.UPHONE;
    app.secBasic.children[4].children[1].value = app.currentUser.UEMAIL;
  };

  //Events

  app.chkBasic.addEventListener("change", e =>
    OnCheckboxChanged(basicKey, app.secBasic, e.target)
  );

  app.chkInfra.addEventListener("change", e =>
    OnCheckboxChanged(infraInvolKey, app.secInfra, e.target)
  );
  app.chkInj.addEventListener("change", e =>
    OnCheckboxChanged(injuryKey, app.secInjury, e.target)
  );
  app.chkTest.addEventListener("change", e =>
    OnCheckboxChanged(testsKey, app.secTest, e.target)
  );
  app.chkInjHosp.addEventListener(
    "change",
    e => (app.postData[injuryKey][e.target.name] = e.target.checked)
  );

  const OnCheckboxChanged = (postkey, sectionElement, target) => {
    if (postkey != basicKey)
      app.postData[postkey][target.name] = target.checked;
    app.showElements([sectionElement], target.checked);
  };

  app.incLoc1.addEventListener("click", e => {
    app.showElements([app.incLocGrp3, app.incLocGrp4]),
      app.showElements([app.incLocGrp2], true);
    app.updateElementText(app.incLocGrp1, "Station");
    app.updateElementText(app.incLocGrp2, "Platform");
  });

  app.incLoc2.addEventListener("click", e => {
    app.showElements([app.incLocGrp2, app.incLocGrp3, app.incLocGrp4]);
    app.updateElementText(app.incLocGrp1, "Location Detail");
  });

  app.incLoc3.addEventListener("click", e => {
    app.showElements([app.incLocGrp2, app.incLocGrp3, app.incLocGrp4], true);
    app.updateElementText(app.incLocGrp1, "Line Name");
    app.updateElementText(app.incLocGrp2, "Chainage (km marker)");
    app.updateElementText(app.incLocGrp3, "Station 1 Name");
    app.updateElementText(app.incLocGrp4, "Station 2 Name");
  });
  app.incLoc4.addEventListener("click", e => {
    app.showElements([app.incLocGrp3, app.incLocGrp4]);
    app.updateElementText(app.incLocGrp1, "Location");
    app.updateElementText(app.incLocGrp2, "Chainage (km marker)");
  });

  app.btnAddTest.addEventListener("click", e => {
    e.preventDefault();
    var test = {};
    test.name = app.testDataInputs.querySelector(
      'input[name="testName"]'
    ).value;
    test.pos = app.testDataInputs.querySelector('input[name="testPos"]').value;
    test.type = app.testDataInputs.querySelector(
      'input[name="testType"]'
    ).value;
    test.date = app.testDataInputs.querySelector(
      'input[name="testDate"]'
    ).value;
    test.result = app.testDataInputs.querySelector(
      'input[name="testResult"]'
    ).value;
    app.appendTest(test);
  });

  app.btnSubmitInc.addEventListener("click", async e => {
    e.preventDefault();
    let frmElements = app.incidentsForm.elements;

    let keys = [
      orgInvolvedKey,
      incTypeKey,
      locKey,
      infraInvolKey,
      injuryKey,
      testsKey,
      descKey
    ];
    keys.forEach(mainKey => {
      Object.keys(app.postData[mainKey]).forEach(key => {
        //ignore checkbox keys
        if (
          ![
            "infraInvolChecked",
            "injuryChecked",
            "injHospAdmChecked",
            "testChecked"
          ].includes(key)
        )
          app.postData[mainKey][key] = frmElements[key].value;
      });
    });
    // add test details
    app.postData["testData"] = app.testData;
    //console.log(app.postData)
    const result = await postData("/incidents/add", app.postData);
    if (result.message) {
      //alert(result.id + " Submitted Successfully !!");
      app.showSuccessMsg(result.id);
    } else alert("not submitted, something went wrong");
  });

  app.showSuccessMsg = newId => {
    app.divMsg.style.display = "flex";
    app.btnSubmitInc.style.display = "none";
    app.incidentsForm.style.display = "none";
    app.divMsg.children[0].innerHTML = `Incident Submitted Successfully !!<br>Reference Number is:
                                        <a href='/incidents/${newId}'>INC-REF-${newId}</a><br>`;
    //app.divMsg.appendChild(createHref("/getIncidents/" + newId,"View Incident"));
    app.divMsg.appendChild(document.createElement("br"));
    app.divMsg.appendChild(createHref("/incidents/new", "Add New Incident"));
  };

  const createHref = (link, text) => {
    const a = document.createElement("a");
    a.href = link;
    a.innerText = text;
    return a;
  };

  app.appendTest = test => {
    let tr = app.tableRow(test);
    app.testData[app.testDataId] = test;
    tr.id = app.testDataId++;
    app.tableTest.tBodies[0].appendChild(tr);
    app.tableTest.classList.remove("hide");
  };

  app.tableRow = data => {
    let tr = document.createElement("tr");
    Object.keys(data).forEach(x => {
      let td = document.createElement("td");
      td.innerText = data[x];
      tr.appendChild(td);
    });
    //add a delete button
    let btn = document.createElement("button");
    btn.innerText = "Delete";
    btn.addEventListener("click", e => app.tableTestDeleteClicked(e));
    tr.appendChild(btn);
    return tr;
  };

  app.tableTestDeleteClicked = e => {
    e.preventDefault();
    const id = e.target.parentElement.id;
    const row = document.getElementById(id).rowIndex;
    app.tableTest.deleteRow(row);
    delete app.testData[id];

    //hide table if no test data
    if (
      Object.keys(app.testData).length === 0 &&
      app.testData.constructor === Object
    ) {
      app.tableTest.classList.add("hide");
      //and reset testID number
      app.testDataId = 100;
    }
  };

  //Helper Functions
  //a helper function to get the selected radion button
  app.getSelectedRadioValue = element => {
    let value = null;
    element.forEach(radio => {
      if (radio.checked) value = radio.value;
    });
    return value;
  };

  app.showElements = (elements, show) =>
    elements.forEach(element => (element.style.display = show ? "" : "none"));

  app.updateElementText = (element, text) => {
    element.children[0].innerText = text;
    element.children[1].placeholder = text;
  };

  app.init();
})();
