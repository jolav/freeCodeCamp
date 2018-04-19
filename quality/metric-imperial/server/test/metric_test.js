/* */

console.log('METRIC_value');
const chai = require('chai');
const expect = require('chai').expect;
const convert = require('./../lib.js').convert;

describe('Metric-imperial convert', function () {
  describe('1 to 1 unit converts', function () {
    const text1 = '1 gallons converts to 3.78541 liters';
    const text2 = '1 liters converts to 0.26417 gallons';
    const text3 = '1 pounds converts to 0.45359 kilograms';
    const text4 = '1 kilograms converts to 2.20462 pounds';
    const text5 = '1 miles converts to 1.60934 kilometers';
    const text6 = '1 kilometers converts to 0.62137 miles';
    it('gal => L', function () {
      expect(convert('1gal')).to.have.property('InitNum', 1);
      expect(convert('1gal')).to.have.property('InitUnit', 'gal');
      expect(convert('1gal')).to.have.property('ReturnNum', 3.78541);
      expect(convert('1gal')).to.have.property('ReturnUnit', 'l');
      expect(convert('1gal')).to.have.property('Text', text1);
    });
    it('L => gal', function () {
      expect(convert('1L')).to.have.property('InitNum', 1);
      expect(convert('1L')).to.have.property('InitUnit', 'l');
      expect(convert('1L')).to.have.property('ReturnNum', 0.26417);
      expect(convert('1L')).to.have.property('ReturnUnit', 'gal');
      expect(convert('1L')).to.have.property('Text', text2);
    });
    it('lbs => kg', function () {
      expect(convert('1lbs')).to.have.property('InitNum', 1);
      expect(convert('1lbs')).to.have.property('InitUnit', 'lbs');
      expect(convert('1lbs')).to.have.property('ReturnNum', 0.45359);
      expect(convert('1lbs')).to.have.property('ReturnUnit', 'kg');
      expect(convert('1lbs')).to.have.property('Text', text3);
    });
    it('kg => lbs', function () {
      expect(convert('1kg')).to.have.property('InitNum', 1);
      expect(convert('1kg')).to.have.property('InitUnit', 'kg');
      expect(convert('1kg')).to.have.property('ReturnNum', 2.20462);
      expect(convert('1kg')).to.have.property('ReturnUnit', 'lbs');
      expect(convert('1kg')).to.have.property('Text', text4);
    });
    it('mi => km', function () {
      expect(convert('1mi')).to.have.property('InitNum', 1);
      expect(convert('1mi')).to.have.property('InitUnit', 'mi');
      expect(convert('1mi')).to.have.property('ReturnNum', 1.60934);
      expect(convert('1mi')).to.have.property('ReturnUnit', 'km');
      expect(convert('1mi')).to.have.property('Text', text5);
    });
    it('km => mi', function () {
      expect(convert('1km')).to.have.property('InitNum', 1);
      expect(convert('1km')).to.have.property('InitUnit', 'km');
      expect(convert('1km')).to.have.property('ReturnNum', 0.62137);
      expect(convert('1km')).to.have.property('ReturnUnit', 'mi');
      expect(convert('1km')).to.have.property('Text', text6);
    });
  });
  describe('only units without number', function () {
    it('going ...', function () {
      expect(convert('gal')).to.have.property('ReturnNum', 3.78541);
      expect(convert('l')).to.have.property('ReturnNum', 0.26417);
      expect(convert('lbs')).to.have.property('ReturnNum', 0.45359);
      expect(convert('kg')).to.have.property('ReturnNum', 2.20462);
      expect(convert('mi')).to.have.property('ReturnNum', 1.60934);
      expect(convert('km')).to.have.property('ReturnNum', 0.62137);
    });
  });
  describe('Invalid data', function () {
    const number = 'invalid number';
    const unit = 'invalid unit';
    const both = 'invalid number and unit';
    it('invalid numbers', function () {
      expect(convert('1$ km')).to.have.property('message', number);
      expect(convert('$ km')).to.have.property('message', number);
      expect(convert('8/5+7km')).to.have.property('message', number);
      expect(convert('8/7/5 km')).to.have.property('message', number);
    // expect(convert('')).to.have.property('message', number)
    });
    it('invalid units', function () {
      expect(convert('23')).to.have.property('message', unit);
      expect(convert('23tt')).to.have.property('message', unit);
      expect(convert('2 lB s')).to.have.property('message', unit);
      expect(convert('1')).to.have.property('message', unit);
    // expect(convert('')).to.have.property('message', unit)
    });
    it('invalid numbers and units', function () {
      expect(convert('')).to.have.property('message', both);
      expect(convert('8/7/5 ')).to.have.property('message', both);
      expect(convert('8/7/5 nein')).to.have.property('message', both);
      expect(convert('23%4$tt')).to.have.property('message', both);
      expect(convert('lg')).to.have.property('message', both);
      expect(convert('lbs24')).to.have.property('message', both);
    // expect(convert('')).to.have.property('message', both)
    });
  });
});
