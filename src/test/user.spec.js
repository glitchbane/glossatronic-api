// import * as mocha from 'mocha';
let chai     = require('chai');
let chaiHttp = require("chai-http");

let mocha = require('mocha');
// let server = require ('../app');
const server = require('..../dist/server');

chai.use(chaiHttp);
const expect         = chai.expect;
process.env.NODE_ENV = 'test';

// NOTE: the following users are expected to be in the test database, and no more:
// {
//     user_id: 2,
//         email: "admin@glossatronic.com",
//     first_name: "fake",
//     last_name: "admin",
//     user_role_id: 1
// },
// {
//     user_id: 3,
//         email: "expert@glossatronic.com",
//     first_name: "fake",
//     last_name: "expert",
//     user_role_id: 2
// },
// {
//     user_id: 4,
//         email: "user@glossatronic.com",
//     first_name: "fake",
//     last_name: "user",
//     user_role_id: 3
// },
// {
//     user_id: 1,
//         email: "glitchbane@gmail.com",
//     first_name: "Sheila",
//     last_name: "Leverson",
//     user_role_id: 1
// }

after((done) => {
    user.User.remove({"email":"testnewperson@gmail.com"}, () => done());
    user.User.remove({"email" : "fortuknit@hotmail.com"}, () => done());

})
describe('User API', () => {

    describe('GET /api/users', () => {

        it('returns an array of all users', () => {

            chai.request(server)
                .get('/v1/user')
                .then(res => {
                    expect(res.status).to.equal(200);
                    expect(res).to.be.json;
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.length(4);
                });
        });
    });

    describe('GET api/users/:id', () => {

        it('responds with single JSON object', () => {
            return chai.request(server).get('/v1/users/1')
                       .then(res => {
                           expect(res.status).to.equal(200);
                           expect(res).to.be.json;
                           expect(res.body).to.be.an('object');
                       });
        });

        it('retrieves the proper user by id', () => {
            return chai.request(server).get('/v1/users/1')
                       .then(res => {
                           let sheila = res.body;

                           expect(sheila).to.exist;
                           expect(sheila.email).to.equal("glitchbane@gmail.com");
                       });
        });

        it('retrieves the proper user by email', () => {
            return chai.request(server).get('/v1/users?email=glitchbane@gmail.com')
                       .then(res => {
                           let sheila = res.body;

                           expect(sheila).to.exist;
                           expect(sheila.email).to.equal("glitchbane@gmail.com");
                       });
        });

        it('contains all required fields', () => {
            return chai.request(server).get('/v1/users/1')
                       .then(res => {
                           let sheila = res.body;

                           expect(sheila).to.exist;
                           expect(sheila).to.have.keys([
                                                        'user_id',
                                                        'email',
                                                        'first_name',
                                                        'last_name',
                                                        'user_role_id'
                                                    ]);

                       });
        });
    });

    // describe('POST v1/users', () => {
    //
    //     let userId;
    //
    //     it(
    //         'successfully saves a valid user', () => {
    //             let newUser = getTestUser();
    //
    //             return chai.request(server).post('/api/user')
    //                        .send(newUser)
    //                        .then(
    //                            (res) => {
    //                                expect(res.status).to.equal(201);
    //                                expect(res).to.be.json;
    //                                expect(res.body).to.be.an('object');
    //                                expect(res.body._id).to.exist;
    //                                userId = res.body._id;
    //                            }
    //                        );
    //         }
    //     );
    //
    //     it(
    //         'successfully deletes a user', () => {
    //             let newUser = getTestUser();
    //
    //             return chai.request(server).del('/api/user/' + userId)
    //                .send(newUser)
    //                .then(
    //                    (res) => {
    //                        expect(res.status).to.equal(200);
    //                    }
    //                );
    //         }
    //     );
    // });
    //
    // describe('POST api/user', () => {
    //
    //     it('does not allow users with duplicate email addresses', (done) => {
    //         let newUser = {"email": "alovelace@gmail.com" };
    //         chai.request(server)
    //             .post('/api/user')
    //             .send(newUser)
    //             .end((err, res) => {
    //                 expect(res).to.have.status(500);
    //                 done();
    //             })
    //     });
    //
    //     it('validates that email is present', (done) => {
    //
    //         let testUser = { "user_id": "6789" };
    //         chai.request(server)
    //             .post('/api/user')
    //             .send(testUser)
    //             .end((err, res) => {
    //                 expect(res).to.have.status(500);
    //                 done();
    //             })
    //     });
    //
    // });
    // let newUserId = null;
    // describe('POST api/user/login', () => {
    //
    //     it(
    //         'sets isLoggedIn to true for a valid user', () => {
    //             let email = {"email": "alovelace@gmail.com"};
    //             return chai.request(server)
    //                        .post('/api/user/login')
    //                        .send(email)
    //                        .then(
    //                            (res) => {
    //                                expect(res.status).to.equal(200);
    //                                expect(res.body.isLoggedIn).to.be.true;
    //                            }
    //                        );
    //         }
    //     );
    //
    //
    //     it(
    //         'creates a new user if the user is not found', (done) => {
    //             let user = {"email": "testnewperson@gmail.com", "authId": "121212"};
    //             chai.request(server)
    //                 .post('/api/user/login')
    //                 .send(user)
    //                 .end((err, res) => {
    //                     expect(res).to.have.status(200);
    //                     expect(res.body.email).to.equal(user.email);
    //                     expect(res.body.authId).to.equal(user.authId);
    //                     expect(res.body._id).not.to.be.null;
    //                     expect(res.body.isLoggedIn).to.be.true;
    //                     done();
    //                 })
    //         }
    //     );
    //
    //     it(
    //         'sets isLoggedIn to false on logout for valid user', (done) => {
    //
    //             let email = {"email": "testnewperson@gmail.com"};
    //             chai.request(server)
    //                 .post('/api/user/logout')
    //                 .send(email)
    //                 .end((err, res) => {
    //                     expect(res).to.have.status(200);
    //                     expect(res.body.isLoggedIn).to.be.false;
    //                     done();
    //                 })
    //         }
    //     );
    //
    //     it(
    //         'returns 500 on logout for invalid user', (done) => {
    //
    //             let email = 'alovele@gmail.com';
    //             chai.request(server)
    //                 .post('/api/user/logout')
    //                 .send(email)
    //                 .end((err, res) => {
    //                     expect(res).to.have.status(500);
    //
    //                     done();
    //                 })
    //         }
    //     );
    // });
    //
    // function getTestUser() {
    //     return { "user_id": "auth0|583f77375e5686fa0d44cfcf", "email": "fortuknit@hotmail.com" };
    // }
});
