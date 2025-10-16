# 🎯 Viva Preparation Checklist - Defect Tracking

## Print This and Check Off Each Item!

---

## ✅ Phase 1: Jira Setup (Due: ______)

### Account Creation
- [ ] Created Jira account at https://www.atlassian.com/software/jira/free
- [ ] Verified email address
- [ ] Can login successfully: https://[your-name].atlassian.net
- [ ] Bookmarked Jira URL: ___________________________

### Project Setup
- [ ] Created project: "Food Ordering API Testing"
- [ ] Project key: FOAT (or note yours: _____)
- [ ] Selected "Scrum" template
- [ ] Dashboard is visible and accessible

---

## ✅ Phase 2: Bug Logging (Due: ______)

### Bug #1: Configuration Exposure (CRITICAL)
- [ ] Created bug in Jira
- [ ] Bug ID: _________ (e.g., FOAT-1)
- [ ] Set Priority: Highest
- [ ] Set Severity: Critical
- [ ] Added Labels: security, configuration, critical
- [ ] Copied detailed description from guide
- [ ] **Reproduction steps documented** (CRITICAL!)
- [ ] Expected vs Actual results documented
- [ ] **Took screenshots**:
  - [ ] Screenshot 1: Exposed configuration (curl output)
  - [ ] Screenshot 2: Vulnerable code in app-vulnerable.js
- [ ] Attached screenshots to Jira bug
- [ ] **Tested reproduction steps** - can demonstrate live
- [ ] Security impact documented
- [ ] Recommended fix documented

**Quick Test:**
```powershell
cd "H:\4th Semester\QA Project\2\backend"
npm run vulnerable
curl http://localhost:5000/api/admin/config
# Do you see exposed credentials? ✓
```

### Bug #2: Missing Security Headers (MAJOR)
- [ ] Created bug in Jira
- [ ] Bug ID: _________ (e.g., FOAT-2)
- [ ] Set Priority: High
- [ ] Set Severity: Major
- [ ] Added Labels: security-headers, clickjacking, xss
- [ ] Copied detailed description from guide
- [ ] **Reproduction steps documented**
- [ ] Expected vs Actual results documented
- [ ] **Took screenshots**:
  - [ ] Screenshot: Chrome DevTools showing missing headers
- [ ] Attached screenshot to Jira bug
- [ ] **Tested reproduction steps** - can demonstrate live
- [ ] Created test-clickjacking.html (optional but impressive)
- [ ] Security impact documented

**Quick Test:**
```powershell
# Server running on http://localhost:5000
# Open Chrome → F12 → Network tab → Check headers
# Missing X-Frame-Options? ✓
```

### Optional Bugs #3 & #4 (For Extra Points)
- [ ] Bug #3: Password Exposure (Major) - Bug ID: _______
- [ ] Bug #4: Information Disclosure (Minor) - Bug ID: _______

---

## ✅ Phase 3: Root Cause Analysis (Due: ______)

### Documentation Created
- [ ] Chose Bug #1 for detailed RCA
- [ ] RCA is 2-3 pages minimum
- [ ] RCA saved in Jira (comment or linked page)
- [ ] **OR** RCA in separate document: _________________

### RCA Content Complete

#### Section 1: Why It Happened
- [ ] Listed primary cause (missing authentication)
- [ ] Listed at least 3 contributing factors:
  - [ ] Lack of security review
  - [ ] Development vs production code mixing
  - [ ] Inadequate access control design
  - [ ] Poor secret management
  - [ ] Insufficient developer training
- [ ] Explained each factor clearly
- [ ] Showed vulnerable code example

#### Section 2: How It Was Fixed
- [ ] Showed secure code implementation
- [ ] Explained authentication middleware
- [ ] Explained authorization checks
- [ ] Explained limited response data
- [ ] Listed at least 5 key improvements:
  - [ ] Authentication layer
  - [ ] Authorization check
  - [ ] Limited response
  - [ ] Error handling
  - [ ] Security headers
  - [ ] Rate limiting (bonus)
  - [ ] Audit logging (bonus)

#### Section 3: Prevention Strategies
- [ ] **Development Process** (at least 3 items):
  - [ ] Security by design
  - [ ] Secure coding standards
  - [ ] Code review checklist
- [ ] **Automated Tools** (at least 2 items):
  - [ ] Static analysis (SonarQube)
  - [ ] Security scanning (OWASP ZAP)
  - [ ] Dependency scanning
- [ ] **CI/CD Integration**:
  - [ ] Described pipeline security checks
  - [ ] Showed example workflow (optional)
- [ ] **Testing Strategy** (at least 2 items):
  - [ ] Security unit tests
  - [ ] Integration tests
  - [ ] Penetration testing
- [ ] **Team Training**:
  - [ ] Listed training topics
  - [ ] Mentioned OWASP Top 10
- [ ] **Monitoring**:
  - [ ] Real-time monitoring
  - [ ] Audit logging
  - [ ] Anomaly detection

#### Section 4: Verification
- [ ] Described how fix was tested
- [ ] Showed before/after comparison
- [ ] Listed test results (passed/failed)

### Quality Check
- [ ] RCA is professional and well-formatted
- [ ] Used technical terms correctly
- [ ] Included code examples
- [ ] No spelling/grammar errors
- [ ] Can explain every point in RCA

---

## ✅ Phase 4: Technical Verification (Due: ______)

### Server Testing
- [ ] **Can start vulnerable server successfully**:
  ```powershell
  cd "H:\4th Semester\QA Project\2\backend"
  npm run vulnerable
  # Should see: "Server running on port 5000"
  ```
- [ ] Server responds on http://localhost:5000
- [ ] Config endpoint accessible: http://localhost:5000/api/admin/config

### Bug Demonstration
- [ ] **Bug #1 can be demonstrated live** (CRITICAL!)
  - [ ] Know the exact command to show the bug
  - [ ] Practiced at least 2 times
  - [ ] Can explain what you're showing
- [ ] **Bug #2 can be demonstrated live**
  - [ ] Know how to open Chrome DevTools
  - [ ] Know where to find headers (Network tab)
  - [ ] Can explain missing headers
- [ ] Have backup plan if server doesn't start

### File Access
- [ ] Know where files are:
  - [ ] Vulnerable code: `backend/app-vulnerable.js`
  - [ ] Secure code: `backend/app-secure.js`
  - [ ] Documentation: `DEFECT_TRACKING_REPORT.md`
- [ ] Can open files quickly during demonstration
- [ ] Can navigate to specific code lines

---

## ✅ Phase 5: Demonstration Practice (Due: ______)

### Timed Run-Through
- [ ] **Practiced full demonstration once**: Time: _____ minutes
- [ ] Target time: 10-15 minutes
- [ ] **Practiced again**: Time: _____ minutes
- [ ] Confidence level: 😰 😐 🙂 😃 🚀 (circle one)

### Demonstration Components

#### Part 1: Introduction (1 min)
- [ ] Can introduce project clearly
- [ ] Can state what you'll demonstrate
- [ ] Sounds confident

#### Part 2: Jira Tour (2 min)
- [ ] Can navigate to Jira quickly
- [ ] Can show bug list/dashboard
- [ ] Can open individual bugs
- [ ] Can explain bug priorities

#### Part 3: Bug #1 Live Demo (4 min)
- [ ] Can start server smoothly
- [ ] Can run curl command (or browser)
- [ ] Can explain what's being exposed
- [ ] Can show vulnerable code
- [ ] Can reference Jira bug
- [ ] Can explain severity

#### Part 4: Root Cause Analysis (4 min)
- [ ] Can navigate to RCA quickly
- [ ] Can explain "Why" it happened
- [ ] Can explain "How" it was fixed
- [ ] Can show secure code
- [ ] Can explain prevention strategies
- [ ] Sounds knowledgeable

#### Part 5: Bug #2 Quick Demo (2 min)
- [ ] Can show missing headers
- [ ] Can reference Jira bug
- [ ] Can explain impact

#### Part 6: Closing (1 min)
- [ ] Can summarize achievements
- [ ] Sounds professional
- [ ] Ready for questions

### Recording (Optional but Recommended)
- [ ] Recorded practice demonstration
- [ ] Watched recording
- [ ] Noted areas for improvement:
  - _________________________________
  - _________________________________
  - _________________________________

---

## ✅ Phase 6: Q&A Preparation (Due: ______)

### Know the Answers

#### Question 1: "How did you find these bugs?"
- [ ] Have clear answer prepared
- [ ] Mention: Manual testing, OWASP ZAP, code review, browser tools
- [ ] Sounds confident: 1 2 3 4 5 (circle)

#### Question 2: "Why is Bug #1 critical?"
- [ ] Can explain exploitability
- [ ] Can explain business impact
- [ ] Can explain compliance issues
- [ ] Sounds confident: 1 2 3 4 5

#### Question 3: "How would you prevent this?"
- [ ] Can list at least 5 prevention strategies
- [ ] Can explain each one
- [ ] Can reference RCA document
- [ ] Sounds confident: 1 2 3 4 5

#### Question 4: "Show me the vulnerable code"
- [ ] Know exact file: `backend/app-vulnerable.js`
- [ ] Know approximate line numbers: 147-179
- [ ] Can open and explain quickly
- [ ] Sounds confident: 1 2 3 4 5

#### Question 5: "Show me the fix"
- [ ] Know exact file: `backend/app-secure.js`
- [ ] Can explain authentication middleware
- [ ] Can explain authorization check
- [ ] Sounds confident: 1 2 3 4 5

#### Question 6: "What testing did you do?"
- [ ] Can mention: Manual testing, automated scanning, code review
- [ ] Can reference test files if needed
- [ ] Can explain test strategy
- [ ] Sounds confident: 1 2 3 4 5

### Other Possible Questions (Prepare Answers)
- [ ] "What is OWASP Top 10?"
  - Answer: __________________________________
- [ ] "What is the difference between severity and priority?"
  - Answer: __________________________________
- [ ] "How long did the RCA take?"
  - Answer: __________________________________
- [ ] "Can you show me other bugs?"
  - Answer: __________________________________

---

## ✅ Phase 7: Backup Materials (Due: ______)

### Digital Backups
- [ ] All screenshots saved in folder: _______________
- [ ] Bug reports exported from Jira (PDF)
- [ ] RCA saved as separate document
- [ ] Guide document accessible: `DEFECT_TRACKING_STEP_BY_STEP_GUIDE.md`
- [ ] USB drive with all materials (optional)

### Printed Backups (In Case Jira/Internet Fails)
- [ ] Printed Bug #1 report (2-3 pages)
- [ ] Printed Bug #2 report (1-2 pages)
- [ ] Printed RCA (2-3 pages)
- [ ] Printed screenshots
- [ ] Printed this checklist
- [ ] All in folder/binder

### Emergency Plan
- [ ] Know what to do if:
  - [ ] Internet fails → Show printed reports
  - [ ] Server won't start → Show screenshots
  - [ ] Jira won't load → Show PDF exports
  - [ ] Computer crashes → Have backup laptop/USB

---

## ✅ Phase 8: Final Verification (Day Before Viva)

### Technical Check
```powershell
# Run these commands successfully:

# 1. Navigate to project
cd "H:\4th Semester\QA Project\2"

# 2. Start server
cd backend
npm run vulnerable

# 3. Test Bug #1
curl http://localhost:5000/api/admin/config
# Sees exposed credentials? ✓

# 4. Access Jira
# Browser: https://[your-name].atlassian.net
# Can see bugs? ✓

# All working? ✓
```

### Content Check
- [ ] At least 2 bugs logged in Jira
- [ ] Each bug has severity
- [ ] Each bug has reproduction steps
- [ ] Each bug has screenshots
- [ ] RCA complete (2-3 pages minimum)
- [ ] RCA covers: Why, How, Prevention

### Demonstration Check
- [ ] Practiced full demo (10-15 min)
- [ ] Can demonstrate live bugs
- [ ] Can navigate Jira confidently
- [ ] Prepared for common questions
- [ ] Have backup materials ready

### Confidence Check
Rate your confidence (1-5, 5=very confident):

- Jira navigation: 1 2 3 4 5
- Live bug demonstration: 1 2 3 4 5
- Explaining RCA: 1 2 3 4 5
- Answering questions: 1 2 3 4 5
- **Overall readiness: 1 2 3 4 5**

**Goal: All 4s or 5s!** If lower, practice more.

---

## ✅ Phase 9: Viva Day Checklist

### Morning Of Viva
- [ ] Good sleep (6-8 hours)
- [ ] Ate breakfast
- [ ] Feeling confident 😃

### Equipment Check
- [ ] Laptop fully charged
- [ ] Charger packed
- [ ] Mouse (if you use one)
- [ ] Internet connection working
- [ ] Backup materials in bag

### 30 Minutes Before
- [ ] Opened Jira - confirmed it works
- [ ] Started vulnerable server - confirmed it works
- [ ] Tested Bug #1 demo - works
- [ ] Reviewed RCA key points
- [ ] Deep breath 🧘

### Just Before Viva
- [ ] Jira open in browser
- [ ] Project folder open in VS Code/Explorer
- [ ] Terminal ready (in backend directory)
- [ ] Backup materials accessible
- [ ] Confident and ready! 🚀

---

## 📊 Grading Estimate

Based on this checklist:

| Requirement | Your Status | Points |
|------------|-------------|--------|
| **Bug Logging (2 minimum)** | □ Complete □ Partial | __/30 |
| - Severity classification | □ Yes □ No | |
| - Reproduction steps | □ Yes □ No | |
| - Screenshots/evidence | □ Yes □ No | |
| **Root Cause Analysis (1 bug)** | □ Complete □ Partial | __/30 |
| - Why it happened | □ Yes □ No | |
| - How it was fixed | □ Yes □ No | |
| - Prevention strategies | □ Yes □ No | |
| **Demonstration** | □ Excellent □ Good □ OK | __/20 |
| - Live bug demo | □ Yes □ No | |
| - Jira navigation | □ Smooth □ OK □ Rough | |
| - Question answers | □ Confident □ OK □ Unsure | |
| **Documentation Quality** | □ Excellent □ Good □ OK | __/20 |
| | **TOTAL** | __/100 |

**Target: 90+** ✅ Achievable if all items checked!

---

## 🆘 Emergency Contacts/Resources

If stuck during preparation:

1. **Guide Document**: `DEFECT_TRACKING_STEP_BY_STEP_GUIDE.md`
2. **Bug Descriptions**: `jira-test-data.md`
3. **Complete Report**: `DEFECT_TRACKING_REPORT.md`
4. **Jira Setup**: `JIRA_BUGZILLA_INTEGRATION_GUIDE.md`
5. **Demo Script**: `VIVA_DEMO_SCRIPT_DEFECT_TRACKING.md`

---

## ✅ Final Sign-Off

I confirm that I have:

- [ ] ✅ Completed all items in Phases 1-7
- [ ] ✅ Practiced demonstration at least twice
- [ ] ✅ Can demonstrate bugs live
- [ ] ✅ Have comprehensive RCA (2-3 pages)
- [ ] ✅ Can answer common questions confidently
- [ ] ✅ Have backup materials ready
- [ ] ✅ **I AM READY FOR MY VIVA!** 🎓🚀

**Signature**: _________________ **Date**: _______

---

## 📈 Progress Tracker

Track your progress:

| Date | Phase Completed | Hours Spent | Notes |
|------|----------------|-------------|-------|
| _____ | Jira Setup | _____ | _____ |
| _____ | Bug #1 | _____ | _____ |
| _____ | Bug #2 | _____ | _____ |
| _____ | RCA | _____ | _____ |
| _____ | Practice Demo | _____ | _____ |
| _____ | Q&A Prep | _____ | _____ |
| _____ | Final Review | _____ | _____ |
| **TOTAL** | | **_____** | |

**Target Total Time**: 4-5 hours

---

## 🎯 Success Criteria

You will succeed if you can:

✅ Show Jira with at least 2 well-documented bugs  
✅ Demonstrate at least 1 bug live (reproduce it)  
✅ Explain detailed root cause analysis (why, how, prevention)  
✅ Answer questions confidently  
✅ Navigate Jira professionally  

**You have everything you need in this project!**

---

**GOOD LUCK! 🍀 YOU'VE GOT THIS! 💪**

---

*Print this checklist and check off items as you complete them!*  
*Keep it with you during viva for confidence!*

---

**Final Confidence Boost**: 

You have:
- ✅ Real bugs in a real application
- ✅ Professional issue tracking setup
- ✅ Comprehensive documentation
- ✅ Complete RCA with prevention strategies
- ✅ Step-by-step guide for everything
- ✅ Practice demonstrations prepared

**Your preparation is thorough. Your documentation is complete. You are ready!** 🌟
