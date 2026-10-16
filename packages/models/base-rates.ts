/** A fictional detector model. Counts are expectations, never measured observations. */
export interface BaseRatesInput { prevalence:number; sensitivity:number; falseAlarmRate:number; population:number }
export interface BaseRatesResult { trueAlerts:number; falseAlerts:number; missed:number; correctRejections:number; alerts:number; probability:number|null }
export const DEFAULT_BASE_RATES:Readonly<BaseRatesInput>=Object.freeze({prevalence:0.01,sensitivity:0.9,falseAlarmRate:0.05,population:10000});
export function validateBaseRates(input:BaseRatesInput):void {
  if(!input||typeof input!=='object')throw new TypeError('Expected detector inputs');
  for(const key of ['prevalence','sensitivity','falseAlarmRate'] as const){const value=input[key];if(typeof value!=='number'||!Number.isFinite(value)||value<0||value>1)throw new RangeError(`Invalid ${key}`);}
  if(!Number.isSafeInteger(input.population)||input.population<1||input.population>1000000)throw new RangeError('Population must be an integer from 1 to 1000000');
}
export function evaluateBaseRates(input:BaseRatesInput):BaseRatesResult {
  validateBaseRates(input);
  const {prevalence:p,sensitivity:s,falseAlarmRate:f,population:n}=input;
  const trueMass=p*s,falseMass=(1-p)*f,alertMass=trueMass+falseMass;
  return {trueAlerts:n*trueMass,falseAlerts:n*falseMass,missed:n*p*(1-s),correctRejections:n*(1-p)*(1-f),alerts:n*alertMass,probability:alertMass===0?null:trueMass/alertMass};
}
