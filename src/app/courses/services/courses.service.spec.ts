import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { COURSES } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe("CoursesService", () => {
  let coursesService: CoursesService,
    httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });
    coursesService = TestBed.inject<CoursesService>(CoursesService);
    httpTestingController = TestBed.inject<HttpTestingController>(
      HttpTestingController
    );
  });

  it("should retrieve all courses", () => {
    coursesService.findAllCourses().subscribe((courses) => {
      expect(courses).toBeTruthy("No courses returned");
      expect(courses.length).toBe(12, "Incorrect number of courses");
      const course = courses.find((course) => course.id === 12);
      expect(course.titles.description).toBe("Angular Testing Course");
    });
    const request = httpTestingController.expectOne("/api/courses"); //Este é o caminho que ele solicita no serviço pra chamar a API
    expect(request.request.method).toEqual("GET"); //Ele testa que o método é o GET e não outro qualquer

    request.flush({
      // Here we will call the payload method and pass all the info that we are receiving from the server (localhost:9000/api/courses)
      payload: Object.values(COURSES),
      // Here we uploaded the COURSES through a mock that has all information in it's values
    });
  });

  it("should find a course by id", () => {
    coursesService.findCourseById(12).subscribe((course) => {
      expect(course).toBeTruthy("No courses returned");
      expect(course.id).toBe(12, "Incorrect number of courses");
    });
    const request = httpTestingController.expectOne("/api/courses/12"); //Este é o caminho que ele solicita no serviço pra chamar a API
    expect(request.request.method).toEqual("GET"); //Ele testa que o método é o GET e não outro qualquer

    request.flush(COURSES[12]);
  });

  it("should save the course data", () => {
    const changes: Partial<Course> = {
      titles: { description: "Testing Course" },
    };
    coursesService.saveCourse(12, changes).subscribe((course) => {
      expect(course.id).toBe(12);
    });
    const request = httpTestingController.expectOne('/api/courses/12')
    expect(request.request.method).toEqual('PUT')
    expect(request.request.body.titles.description).toEqual(changes.titles.description) //We are checking the body that we receive with the changes we are sending through the changes const we created
    request.flush({
        ...COURSES[12], //original 
        ...changes      //the changes we want
    })
  });

  it('should give an error if save course fails', () => {
    const changes: Partial<Course> = {
        titles: { description: "Testing Course" },
      };
      coursesService.saveCourse(12, changes).subscribe(
          () => fail('The server course operation should have failed')),
          (error: HttpErrorResponse) => {
            expect(error.status).toBe(500)
        }
        const req = httpTestingController.expectOne('/api/courses/12')
        expect(req.request.method).toEqual('PUT')
        req.flush('Save course failed', {status: 500, statusText: 'Internal server error'})
  })

  afterEach(() => {
    httpTestingController.verify();
    // it verifies that the http is only being called once in each test, avoiding mistakes
  });
});
