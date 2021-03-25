const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../../server');
const { expect } = require('chai');
const credentials = require('../../config/credentials');
const Helper = require('../../helper');

chai.use(chaiHttp);
const agent = chai.request.agent(app);
const helper = new Helper();

before('before', function (done) {
    agent
        .post('/api/auth/login')
        .send(credentials.Admin)
        .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.exist;
            expect(res.body).to.not.have.property('error');
        });
});

describe('/api/forum', function () {
    this.timeout(20000);

    describe('GET /api/forum', function () {
        it('should get forum data', function (done) {
            agent
                .get('/api/forum')
                .send({
                    AcademicYearRowId: null,
                    FilterStatusRowId: 1,
                    FilterSetRowId: 4,
                    FilterRowId: '0'
                })
                .end((err, res) => {
                    expect(res.body).to.exist;
                    expect(res.status).to.exist;
                    expect(res.status).to.equal(200, helper.mochaErrorCheck(res));

                    done();
                });
        });
    });

    describe('POST /api/forum', function () {
        it('should create a forum', function (done) {
            agent
                .post('/api/forum')
                .send({
                    BoardName: 'test from mocha',
                    BoardDescription: 'mocha testing'
                })
                .end((err, res) => {
                    expect(res.body).to.exist;
                    expect(res.status).to.exist;
                    expect(res.status).to.equal(200, helper.mochaErrorCheck(res));

                    done();
                });
        });
    });
});
