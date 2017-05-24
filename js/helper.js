/*
 * Copyright (C) 2016 TopCoder Inc., All Rights Reserved.
 */

/**
 * This file contains all helper functions invoked throughout the app
 */

var ONE_THOUSAND = Math.pow(10, 3);
var ONE_MILLION = Math.pow(10, 6);
var ONE_BILLION = Math.pow(10, 9);
var ONE_TRILLION = Math.pow(10, 12);
var ONE_QUADRILLION = Math.pow(10, 15);
var ONE_QUINTILLION = Math.pow(10, 18);

/**
 * Function to convert an integer to word
 * Determines the word for a digit (there are some unique words within 100)
 * @param {Number} integer to be converted
 * @returns {String} word representation of that integer
 */
function integerToWord(integer) {
  var prefix = '';
  var suffix = '';

  if(!integer){ return "zero"; }
  
  /* For negative words prefix negative key */
  if(integer < 0){
    prefix = "negative";
    suffix = integerToWord(-1 * integer);
    return prefix + " " + suffix;
  }
  /* Determine the unique words in numbering system within 100 */
  if(integer <= 90){
    switch (integer) {
      case integer < 0:
        prefix = "negative";
        suffix = integerToWord(-1 * integer);
        return prefix + " "  + suffix;
      case 1: return "one";
      case 2: return "two";
      case 3: return "three";
      case 4:  return "four";
      case 5: return "five";
      case 6: return "six";
      case 7: return "seven";
      case 8: return "eight";
      case 9: return "nine";
      case 10: return "ten";
      case 11: return "eleven";
      case 12: return "twelve";
      case 13: return "thirteen";
      case 14: return "fourteen";
      case 15: return "fifteen";
      case 16: return "sixteen";
      case 17: return "seventeen";
      case 18: return "eighteen";
      case 19: return "nineteen";
      case 20: return "twenty";
      case 30: return "thirty";
      case 40: return "forty";
      case 50: return "fifty";
      case 60: return "sixty";
      case 70: return "seventy";
      case 80: return "eighty";
      case 90: return "ninety";
      default: break;
    }
  }

  if(integer < 100){
    prefix = integerToWord(integer - integer % 10);
    suffix = integerToWord(integer % 10);
    return prefix + "-"  + suffix;
  }

  /* Determine the words based on the number range */
  if(integer < ONE_THOUSAND){
    prefix = integerToWord(parseInt(Math.floor(integer / 100), 10) )  + " hundred";
    if(integer % 100){ suffix = " and "  + integerToWord(integer % 100); }
    return prefix + suffix;
  }
  if(integer < ONE_MILLION){
    prefix = integerToWord(parseInt(Math.floor(integer / ONE_THOUSAND), 10))  + " thousand";
    if(integer % ONE_THOUSAND){ suffix = integerToWord(integer % ONE_THOUSAND); }
  }
  else if(integer < ONE_BILLION){
    prefix = integerToWord(parseInt(Math.floor(integer / ONE_MILLION), 10))  + " million";
    if(integer % ONE_MILLION){ suffix = integerToWord(integer % ONE_MILLION); }
  }
  else if(integer < ONE_TRILLION){
    prefix = integerToWord(parseInt(Math.floor(integer / ONE_BILLION), 10))  + " billion";
    if(integer % ONE_BILLION){ suffix = integerToWord(integer % ONE_BILLION); }
  }
  else if(integer < ONE_QUADRILLION){
    prefix = integerToWord(parseInt(Math.floor(integer / ONE_TRILLION), 10))  + " trillion";
    if(integer % ONE_TRILLION){ suffix = integerToWord(integer % ONE_TRILLION); }
  }
  else if(integer < ONE_QUINTILLION){
    prefix = integerToWord(parseInt(Math.floor(integer / ONE_QUADRILLION), 10))  + " quadrillion";
    if(integer % ONE_QUADRILLION){ suffix = integerToWord(integer % ONE_QUADRILLION); }
  } else {
    return '';
  }
  return prefix + " "  + suffix;
}

/**
 * Function to convert money (number) to words
 * @param {Number} date in string or Date
 * @returns {String} money in words (dollars and cents)
 */
function moneyToWord(value){
  var decimalValue = (value % 1);
  var integer = value - decimalValue;
  decimalValue = Math.round(decimalValue * 100);
  /* Display decimal value in cents */
  var decimalText = !decimalValue? '': integerToWord(decimalValue) + ' cent' + (decimalValue === 1? '': 's');
  var integerText= !integer? '': integerToWord(integer) + ' dollar' + (integer === 1? '': 's');
  return (
    integer && !decimalValue? integerText:
    integer && decimalValue? integerText + ' and ' + decimalText:
    !integer && decimalValue? decimalText:
    'zero cents'
  );
}

/**
 * Function to capitalize the first letter of a word
 * @param {String} word to be capitalized first letter
 * @returns {String} word with first letter capitalized
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Function to format date in MM/dd/yyyy
 * @param {Date} Date object to be formatted
 * @returns {String} Formatted string in required format
 */
function formatDate(date){
  return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
}
