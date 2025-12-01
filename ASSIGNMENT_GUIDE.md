# 📚 CORS Security Demo - Student Assignment Guide

## 🎓 Assignment Overview

**Course**: Secure Web Software Development  
**Module**: Web Application Security  
**Topic**: CORS (Cross-Origin Resource Sharing) Misconfiguration  
**Difficulty**: Intermediate  
**Duration**: 2-3 weeks  
**Platform**: Node.js + Express + Render  

---

## 🎯 Assignment Objectives

Upon completion, you should be able to:

1. **Identify** CORS misconfigurations in web applications
2. **Explain** how CORS attacks lead to data exfiltration
3. **Implement** CORS whitelist protection
4. **Test** CORS security using multiple methods
5. **Deploy** securely to production (Render)
6. **Monitor** CORS violations in production
7. **Document** security decisions and implementations

---

## 📋 Assignment Requirements

### Part 1: Understanding (Week 1)

#### Task 1.1: Read Documentation
- [ ] Read `CORS_VULNERABILITY.md` - Understand the vulnerability
- [ ] Read `IMPLEMENTATION.md` - Learn the fix
- [ ] Read `ARCHITECTURE.md` - Understand system design
- **Time**: 2-3 hours
- **Deliverable**: Notes/summary

#### Task 1.2: Analyze Code
- [ ] Review `controllers/client/cors.controller.js`
- [ ] Identify vulnerable code patterns
- [ ] Identify secure code patterns
- [ ] Document differences
- **Time**: 1-2 hours
- **Deliverable**: Code analysis document (500+ words)

#### Task 1.3: Run Local Demo
- [ ] Start server (`npm start`)
- [ ] Open `http://localhost:3000/cors-demo/`
- [ ] Click "Attack" button
- [ ] Observe attack logs
- [ ] Click "Test" button
- [ ] Observe protection
- **Time**: 1 hour
- **Deliverable**: Screenshots with annotations

---

### Part 2: Testing (Week 2)

#### Task 2.1: Manual Testing
- [ ] Test vulnerable endpoint with cURL
- [ ] Test secure endpoint (rejected)
- [ ] Test secure endpoint (allowed)
- [ ] Verify CORS headers
- [ ] Check Vary header
- [ ] Document results
- **Time**: 2 hours
- **Deliverable**: Test report with cURL commands and responses

#### Task 2.2: Automated Testing
- [ ] Run test cases from `TEST_CASES.md`
- [ ] Execute JavaScript test examples
- [ ] Test edge cases
- [ ] Document test coverage
- [ ] Create test summary
- **Time**: 2 hours
- **Deliverable**: Test results document + code snippets

#### Task 2.3: Security Testing
- [ ] Test with different origins
- [ ] Test with malformed headers
- [ ] Test with special characters
- [ ] Test rate limiting (if implemented)
- [ ] Test error handling
- **Time**: 2 hours
- **Deliverable**: Security test report

---

### Part 3: Implementation (Week 2-3)

#### Task 3.1: Understand Current Implementation
- [ ] Review CORS controller code
- [ ] Review CORS middleware
- [ ] Review route configuration
- [ ] Trace request flow
- **Time**: 1-2 hours
- **Deliverable**: Flow diagram + explanation

#### Task 3.2: Configuration Management
- [ ] Update `.env.example` with CORS_WHITELIST documentation
- [ ] Document environment variables
- [ ] Show different configs for dev/prod
- [ ] Explain whitelist format
- **Time**: 1 hour
- **Deliverable**: .env documentation

#### Task 3.3: Security Improvements (Optional)
- [ ] Add CORS violation logging
- [ ] Implement rate limiting on CORS rejections
- [ ] Add security headers (X-Frame-Options, etc.)
- [ ] Implement request validation
- **Time**: 2-3 hours
- **Deliverable**: Code changes + documentation

---

### Part 4: Deployment (Week 3)

#### Task 4.1: Prepare Repository
- [ ] Ensure all code committed
- [ ] Update .env.example
- [ ] Verify no secrets in code
- [ ] Run all tests locally
- [ ] Document deployment steps
- **Time**: 1 hour
- **Deliverable**: Deployment checklist

#### Task 4.2: Deploy to Render
- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Configure environment variables
- [ ] Deploy application
- [ ] Verify endpoints working
- **Time**: 2 hours
- **Deliverable**: Deployment confirmation + screenshots

#### Task 4.3: Production Testing
- [ ] Test vulnerable endpoint on Render
- [ ] Test secure endpoint (rejected)
- [ ] Test secure endpoint (allowed)
- [ ] Check logs on Render dashboard
- [ ] Document results
- **Time**: 1-2 hours
- **Deliverable**: Production test report

#### Task 4.4: Monitoring Setup
- [ ] View Render logs
- [ ] Search for CORS violations
- [ ] Document monitoring approach
- [ ] Create alert strategy
- **Time**: 1 hour
- **Deliverable**: Monitoring plan document

---

### Part 5: Documentation & Presentation

#### Task 5.1: Write Final Report
Include sections:
- [ ] **Executive Summary** (1 page)
  - What is CORS
  - Why it matters
  - What you did
  
- [ ] **Vulnerability Analysis** (2-3 pages)
  - Vulnerability description
  - Attack scenarios
  - Impact analysis
  - Code examples
  
- [ ] **Implementation** (2-3 pages)
  - Solution overview
  - Code changes
  - Configuration
  - Testing approach
  
- [ ] **Testing** (2-3 pages)
  - Test cases run
  - Test results
  - Coverage summary
  - Security testing
  
- [ ] **Deployment** (1-2 pages)
  - Deployment process
  - Configuration on Render
  - Production verification
  - Monitoring setup
  
- [ ] **Lessons Learned** (1-2 pages)
  - Key takeaways
  - Best practices
  - Recommendations
  - Future improvements

**Total**: 10-15 pages  
**Time**: 4-5 hours  
**Deliverable**: PDF report

#### Task 5.2: Prepare Presentation
- [ ] Create slides (15-20 slides)
- [ ] Include demo video or live demo
- [ ] Show code examples
- [ ] Explain attack flow
- [ ] Demonstrate fix
- [ ] Show test results
- [ ] Discuss deployment
- **Time**: 3-4 hours
- **Deliverable**: Presentation slides + demo

#### Task 5.3: Record Demo Video (Optional)
- [ ] Record local demo (vulnerable endpoint)
- [ ] Show attack happening
- [ ] Show secure endpoint protection
- [ ] Narrate the process
- [ ] Length: 5-10 minutes
- **Time**: 1-2 hours
- **Deliverable**: Video file (MP4/WebM)

---

## 📊 Grading Rubric

### Understanding (20%)
| Criteria | Excellent (A) | Good (B) | Fair (C) | Poor (D) |
|----------|---------------|---------|---------|----------|
| **Vulnerability Knowledge** | Comprehensive understanding | Good understanding | Basic understanding | Limited understanding |
| **Code Analysis** | Deep analysis with insights | Thorough analysis | Basic analysis | Superficial analysis |
| **Documentation Reading** | Read all docs thoroughly | Read most docs | Read some docs | Minimal reading |

### Implementation (30%)
| Criteria | Excellent (A) | Good (B) | Fair (C) | Poor (D) |
|----------|---------------|---------|---------|----------|
| **Code Quality** | Clean, well-commented | Good quality | Acceptable | Needs improvement |
| **Security Implementation** | Excellent practices | Good practices | Basic implementation | Incomplete |
| **Configuration** | Proper env setup | Mostly correct | Some issues | Incorrect |

### Testing (20%)
| Criteria | Excellent (A) | Good (B) | Fair (C) | Poor (D) |
|----------|---------------|---------|---------|----------|
| **Test Coverage** | Comprehensive tests | Most scenarios | Some scenarios | Few tests |
| **Test Documentation** | Detailed results | Good documentation | Basic docs | Minimal docs |
| **Security Testing** | Thorough security tests | Good testing | Basic testing | Limited testing |

### Deployment (15%)
| Criteria | Excellent (A) | Good (B) | Fair (C) | Poor (D) |
|----------|---------------|---------|---------|----------|
| **Render Deployment** | Properly deployed | Deployed | Attempted | Not deployed |
| **Configuration** | Correct setup | Mostly correct | Some issues | Incorrect |
| **Verification** | Fully verified | Mostly verified | Partially verified | Not verified |

### Documentation (15%)
| Criteria | Excellent (A) | Good (B) | Fair (C) | Poor (D) |
|----------|---------------|---------|---------|----------|
| **Report Quality** | Comprehensive, clear | Good quality | Acceptable | Needs work |
| **Presentation** | Excellent delivery | Good delivery | Acceptable | Poor delivery |
| **Clarity** | Very clear | Clear | Somewhat clear | Unclear |

---

## 📦 Deliverables Checklist

### Code & Configuration
- [ ] ✅ CORS controller implemented correctly
- [ ] ✅ CORS routes configured
- [ ] ✅ Security middleware (optional enhancement)
- [ ] ✅ .env properly configured
- [ ] ✅ .env.example documented

### Testing
- [ ] ✅ Manual tests executed and documented
- [ ] ✅ Automated tests created/run
- [ ] ✅ Security tests performed
- [ ] ✅ Test report written
- [ ] ✅ Edge cases tested

### Documentation
- [ ] ✅ Code analysis document (500+ words)
- [ ] ✅ Test report with results
- [ ] ✅ Final project report (10-15 pages)
- [ ] ✅ Presentation slides (15-20 slides)
- [ ] ✅ Deployment documentation

### Deployment
- [ ] ✅ Code deployed to Render
- [ ] ✅ Environment variables set
- [ ] ✅ Endpoints verified working
- [ ] ✅ Logs accessible
- [ ] ✅ Deployment documented

### Presentation
- [ ] ✅ Presentation prepared
- [ ] ✅ Demo ready (live or video)
- [ ] ✅ Code examples included
- [ ] ✅ Questions anticipated
- [ ] ✅ Timing verified (15-20 min)

---

## 🎬 Demo Preparation

### Live Demo Script

**Duration**: 15 minutes  
**Setup**: Laptop + projector/screen

**Script**:
```
0:00 - Introduction (1 min)
      "Today I'll show you a CORS vulnerability and how to fix it"

0:30 - Show Vulnerable Code (2 min)
      - Display cors.controller.js (insecure endpoint)
      - Highlight: Access-Control-Allow-Origin: *
      - Explain the problem

2:30 - Run Attack Demo (3 min)
      - Open demo page
      - Click "Attack" button
      - Show real-time logs
      - Demonstrate data exfiltration
      - Explain what happened

5:30 - Show Secure Code (2 min)
      - Display cors.controller.js (secure endpoint)
      - Highlight: Whitelist validation
      - Explain the fix

7:30 - Run Protection Demo (3 min)
      - Click "Test Secure" button
      - Show rejection for non-whitelisted
      - Show success for whitelisted
      - Explain validation process

10:30 - Show Deployment (3 min)
       - Show Render dashboard
       - Show environment variables
       - Show monitoring logs
       - Explain production setup

13:30 - Questions (1:30 min)
       - Answer student questions
       - Discuss improvements
       - Mention lessons learned
```

---

## 💡 Tips for Success

### Do's ✅
- ✅ Start early - don't wait until last minute
- ✅ Read all documentation thoroughly
- ✅ Test locally first before deploying
- ✅ Use environment variables properly
- ✅ Document everything you do
- ✅ Keep notes during the project
- ✅ Test edge cases
- ✅ Monitor production after deployment
- ✅ Ask questions if stuck
- ✅ Review security best practices

### Don'ts ❌
- ❌ Don't use `*` in production
- ❌ Don't hardcode secrets
- ❌ Don't skip documentation
- ❌ Don't deploy without testing
- ❌ Don't ignore error messages
- ❌ Don't forget to set environment variables
- ❌ Don't skip monitoring setup
- ❌ Don't present unprepared
- ❌ Don't assume everything works
- ❌ Don't skip security steps

---

## 🆘 Getting Help

### Resources Available
1. **Documentation** - Read security-demo/cors/docs/
2. **Code Comments** - Review inline code comments
3. **Examples** - Check TEST_CASES.md for examples
4. **Office Hours** - Ask instructor for help
5. **Slack/Discord** - Discuss with classmates
6. **Stack Overflow** - Search for CORS questions
7. **MDN Docs** - Learn about CORS details

### Common Issues & Solutions

**Issue**: CORS headers not showing  
**Solution**: Ensure you're testing the right endpoint

**Issue**: Getting 403 on whitelisted origin  
**Solution**: Check whitelist in .env matches EXACTLY

**Issue**: Demo page not loading  
**Solution**: Start server with `npm start`

**Issue**: Deployment failed  
**Solution**: Check environment variables on Render

**Issue**: Can't access endpoints  
**Solution**: Verify server is running and accessible

---

## 📅 Timeline Recommendation

### Week 1: Learning
- Day 1-2: Read documentation (6 hours)
- Day 3-4: Analyze code (4 hours)
- Day 5: Run local demo (2 hours)
- **Total**: ~12 hours

### Week 2: Testing & Implementation
- Day 1-2: Manual testing (4 hours)
- Day 3-4: Automated testing (4 hours)
- Day 5: Security testing (2 hours)
- Day 6-7: Implementation improvements (4 hours)
- **Total**: ~14 hours

### Week 3: Deployment & Documentation
- Day 1-2: Prepare repository (2 hours)
- Day 3-4: Deploy to Render (4 hours)
- Day 5-6: Write final report (10 hours)
- Day 7: Prepare presentation (6 hours)
- **Total**: ~22 hours

**Total Project Time**: ~48 hours (3 weeks × 16 hours/week)

---

## 🎓 Learning Resources

### Online Courses
- [MDN Web Docs: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [OWASP: CORS](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Origin_Resource_Sharing_Cheat_Sheet.html)
- [PortSwigger: CORS](https://portswigger.net/web-security/cors)

### Books
- "Web Application Security" by Andrew Hoffman
- "The Web Application Hacker's Handbook"

### Security Blogs
- [Snyk Blog - CORS](https://snyk.io/)
- [Auth0 Security Blog](https://auth0.com/blog/security/)

### Practice Sites
- [OWASP WebGoat](https://owasp.org/www-project-webgoat/)
- [HackTheBox](https://www.hackthebox.com/)

---

## ✨ Extra Credit Opportunities

### Advanced Tasks (Bonus Points)
1. **Implement Rate Limiting** (5 points)
   - Limit CORS requests per origin
   - Track violations
   - Alert on threshold

2. **Add Security Headers** (5 points)
   - X-Frame-Options
   - X-Content-Type-Options
   - Content-Security-Policy

3. **Create Admin Dashboard** (10 points)
   - Display CORS statistics
   - Show violations over time
   - Manage whitelist
   - Real-time monitoring

4. **Write Unit Tests** (5 points)
   - Jest test suite
   - Test all scenarios
   - Automate validation

5. **Security Audit** (5 points)
   - Check for other vulnerabilities
   - Recommend fixes
   - Document findings

6. **Performance Optimization** (5 points)
   - Cache whitelist
   - Optimize validation
   - Measure performance

---

## 🎯 Final Checklist

Before submission:
- [ ] All code committed to GitHub
- [ ] Deployed to Render and working
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Report written (10-15 pages)
- [ ] Presentation prepared (15-20 slides)
- [ ] Demo tested and working
- [ ] No hardcoded secrets
- [ ] Environment variables configured
- [ ] Monitoring set up
- [ ] Lessons learned documented
- [ ] Ready to present!

---

## 📞 Submission Instructions

### What to Submit
1. **GitHub Repository Link**
   - URL to your repo
   - Branch: main
   - All code committed

2. **Render Deployment Link**
   - URL: https://your-app.render.com
   - Verify endpoints working
   - Show logs accessible

3. **Project Report** (PDF)
   - 10-15 pages
   - Formatted professionally
   - Include code snippets
   - Include screenshots

4. **Presentation Slides** (PDF/PPTX)
   - 15-20 slides
   - Include demo screenshots
   - Include code examples
   - Notes section filled out

5. **Demo Video** (MP4/WebM - Optional)
   - 5-10 minutes
   - Recorded locally
   - Show attack and protection
   - Narrated

### Submission Deadline
- **Due Date**: [Your due date]
- **Format**: Submit via [Your LMS]
- **Late Policy**: [Your late policy]

---

**Good Luck! 🍀**

**Remember**: Security is not a feature, it's a responsibility!

---

**Document Version**: 1.0  
**Last Updated**: December 2024  
**Course**: Secure Web Software Development  

Questions? Ask your instructor!
