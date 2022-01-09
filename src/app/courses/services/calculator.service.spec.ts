import { TestBed } from "@angular/core/testing";
import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";

describe("CalculatorService", () => {
    let calculator: CalculatorService,
    loggerSpy: any
    // When we are testing more than one implementation and the way that they interact together, we use a integration test, not a unit test
    beforeEach(()=> {
        console.log("Calling beforeEach")
        // This function will be executed beforeEach executation
        loggerSpy = jasmine.createSpyObj('LoggerService', ['log']) //Mock of loggerService
        // TestBed will be used instead of new CalculatorService so we don't have to declare our dependencies this way, that is not common on angular
        TestBed.configureTestingModule({
            providers: [
                CalculatorService,
                {provide: LoggerService, useValue: loggerSpy}
            ]
        })
        // Why are we mocking loggerService and inject only CalculatorService? Cause we want to test only CalculatorService here
        calculator = TestBed.inject<CalculatorService>(CalculatorService)
      
        // We use this to avoid repetition - be as 'dry' as possible
    })

  // What is a specification? Is a simply functional test
  // A group of specs is a test suit

  // Specification
// we can add an 'x' before the function to disable it
// Also, we can add an 'f' to focus on only one test
  it("should add two numbers", () => {
    //It should describe a functional feature
    // pending(); //It gives the Jasmine an advice that this is not ready to best tested yet

    // It creates a fake implementation of the loggerService and we add in 'log' in the list of methods that this 'implementation' has
    // const logger = jasmine.createSpyObj('LoggerService', ['log'])

    // If this log returned some value and we wanted to test, we could also create a method that test it using jasmine:
    // logger.log.and.returnValue()

    // spyOn(logger, 'log') //It will catch the logger and spy on 'log' by switching it by it's own function

    // While using unit tests we only want to test one unit - like CalculatorService here, so we will create a mock of the loggerService cause we don't want to test it here
    // const calculator = new CalculatorService (logger) //CalculatorService has one dependecy, that's why we called loggerService inside it, but loggerService does not have any dependecy
    console.log("add test")
    const result = calculator.add(2,2)
    expect(result).toBe(4)
    expect(loggerSpy.log).toHaveBeenCalledTimes(1) //It tests how many times this function will be called


  });

  it("should subtract two numbers", () => {
    // const logger = jasmine.createSpyObj('LoggerService', ['log'])
    //It should describe a functional feature
    // const calculator = new CalculatorService (new LoggerService) //CalculatorService has one dependecy, that's why we called loggerService inside it, but loggerService does not have any dependecy
    // const calculator = new CalculatorService (logger)
    console.log("subtract test")
    const result = calculator.subtract(2,2)
    expect(result).toBe(0, "unexpected subtraction result")
    expect(loggerSpy.log).toHaveBeenCalledTimes(1) //It tests how many times this function will be called
  });
});
