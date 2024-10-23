"use strict";
/* ui data*/
const LCD = {
    history: $('#history'),
    currentNumber: $('#show-number'),
    action: $('#show-action'),
    btnNum: $('#nums button'),
    cal: $('#calculator')
}
/* process data*/
const process = {
    action: '',
    nextNum: 0,
    result: 0,
    history: 0,
}

/*
clear ui & Process
params isAll: boolean
*/
function doClear(isAll = false) {
    LCD.action.text('');
    LCD.currentNumber.val('');
    process.action = '';

    if (isAll) {
        LCD.history.text('');
        process.history = 0;
    } else {
        process.nextNum = 0;
        process.result = 0;
        LCD.history.append('<hr/>');
    }

}


/*
get action from user
* params action must be one of '* - / +'
*/
function setAction(action) {
    LCD.action.text(action);
    if (process.action !== '') {
        /*change getNum() place for do not take time to run and do not skip  */
        doAction(action);

    } else {

        if (LCD.currentNumber.val() !== '') {
            process.result = parseFloat(LCD.currentNumber.val());
        } else {
            process.result = process.history;
        }
        process.action = action;

    }
    LCD.currentNumber.val('');

}


/*
get action from setAction
params action:number
*/
function doAction(action = null) {
    if (LCD.currentNumber.val().length < 1) return alert('you didnt input number');
    if (process.action === '') return alert('your action is blank'); //this code return nothing if true else execute code below

    let result = 0;
    process.nextNum = parseFloat(LCD.currentNumber.val());
    result = operation[process.action]();
    addHistory(parseFloat(result));
    process.result = parseFloat(result);

    if (action !== null) {
        process.action = action;
    } else {
        doClear();
    }


}

/*
just for showing history in ui
params result:number
*/
function addHistory(result) {
    let elements = (`${process.result} ${process.action} ${parseFloat(process.nextNum)}=${parseFloat(result)} <br>`);
    LCD.history.append(elements);
    process.history = result;
}

/*
all operation:object & value of each key is function to do action '/*-+'
 */
let operation = {
    '/': () => process.result / process.nextNum,
    '*': () => process.result * process.nextNum,
    '-': () => process.result - process.nextNum,
    '+': () => process.result + process.nextNum,

}
/*show nums from numpad */
LCD.btnNum.on('click', function () {
    const number = $(this).text();
    LCD.currentNumber.val(LCD.currentNumber.val() + number);
})

/*able to get number without focus*/
/*$("body").on("keydown", function () {
    $("#show-number[name='show-num']").focus();
});*/


/*get keyboard actions */
LCD.cal.on('mouseover', function () {
    $(document).bind('keydown', function (e) {

        const numberCode = {
            keyNum: LCD.cal.find(`#nums button[code=${e.keyCode}]`),
            keyAction: LCD.cal.find(`#operation button[action-code=${e.keyCode}]`),
            keyEqual: LCD.cal.find(`button[equal-code=${e.keyCode}]`),
            keyClearAll: LCD.cal.find(`button[clear-all=${e.keyCode}]`),
            keyClear: LCD.cal.find(`button[clear=${e.keyCode}]`),
        }
        numberCode.keyNum.trigger('click');
        numberCode.keyAction.trigger('click');
        numberCode.keyEqual.trigger('click');
        numberCode.keyClear.trigger('click');

        if (e.shiftKey !== false) {
            numberCode.keyClearAll.trigger('click');
        }
    })

}).on("mouseout", function () {
    $(document).unbind("keydown");
});
