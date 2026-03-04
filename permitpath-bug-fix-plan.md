# PermitPath Critical Bug Fixes & Feature Completion Plan

## CRITICAL BUGS - MUST FIX IMMEDIATELY

### 1. Form Navigation Failure (P0 - Blocking)
**Issue:** Next button from Details → Requirements doesn't work; users cannot proceed
**Root Cause:** State management or step validation logic broken
**Files to Check:**
- `src/components/wizard/SmartWizard.tsx` - Step progression logic
- `src/pages/WizardPage.tsx` - Wizard container
- `src/hooks/useJobs.ts` - State management

**Fix Required:**
- Debug step index/state transitions
- Fix validation logic that may be preventing progression
- Ensure "Next" button properly advances to Requirements step
- Add console logging to trace the failure point

**Time:** 1-2 hours

### 2. No Job Submission/Save (P0 - Blocking)
**Issue:** No visible "Create Job" or "Submit" button; form data isn't saved
**Root Cause:** Missing final submission step in wizard

**Fix Required:**
- Add "Review & Submit" as final step in wizard
- Create Summary page showing all entered data
- Add "Submit Job" button that:
  - Validates all required fields
  - Saves job to database/localStorage
  - Shows success confirmation
  - Redirects to job detail page
- Add "Save as Draft" option for incomplete jobs

**New Files:**
- `src/components/wizard/WizardSummary.tsx` - Review page
- Update `src/components/wizard/SmartWizard.tsx` - Add submit logic

**Time:** 3-4 hours

### 3. Address Validation Missing (P0 - Data Quality)
**Issue:** Auto-fills with placeholder "123 Main St, St Petersburg, FL 33710" without verification

**Fix Required:**
- Remove placeholder address
- Add Google Places API or similar for address autocomplete
- Validate address is in Pinellas County
- Show address on map for confirmation
- Store lat/lng coordinates
- Add "Verify Address" button

**Files:**
- `src/components/wizard/LocationStep.tsx` (or create)
- Update address input throughout wizard

**Time:** 2-3 hours

---

## MISSING CRITICAL INFORMATION - ADD REQUIRED FIELDS

### 4. Contractor Information Capture
**Missing:** Name, license number, experience level, insurance

**Add to Details Step:**
- Contractor Name (text input)
- License Number (text input with validation)
- Years of Experience (dropdown: 0-2, 3-5, 5-10, 10+)
- Has Insurance (yes/no toggle)
- Upload License Photo (file upload)

**Validation:** Check license format (FL-specific pattern)

### 5. Budget/Cost Expectations
**Missing:** No cost discussion

**Add to Details Step:**
- Estimated Project Cost (dropdown ranges)
- Who's paying (homeowner, contractor, split)
- Budget flexibility (strict, somewhat flexible, very flexible)

### 6. Project Timeline
**Missing:** No timeline captured

**Add to Details Step:**
- Desired Start Date (date picker)
- Project Duration Estimate (dropdown)
- Timeline Flexibility (rigid, somewhat flexible, very flexible)

### 7. Building Type Specifics
**Missing:** Single vs multi-story, existing structure details

**Add to Location or Details Step:**
- Property Type (single-family, condo, townhouse, commercial)
- Number of Stories
- Year Built (affects permit requirements)
- Is this a modification to existing work? (yes/no)

### 8. Permit History
**Missing:** Previous violations, existing permits

**Add to Details Step:**
- Has there been previous work on this? (yes/no)
- Are there open permits for this property? (yes/no/unsure)
- Any known code violations? (yes/no/unsure)

---

## ACCURACY IMPROVEMENTS

### 9. Job-Specific Questions
**Issue:** Generic questions don't account for job complexity

**Fix:** Create question templates per job type:

**Bathroom Vanity:**
- Is this replacing existing or new installation?
- Are you moving plumbing locations? (critical for permits)
- Electrical work needed? (outlets, lighting)
- Flooring being changed?

**Roof:**
- Percentage of roof being replaced
- Is this a repair or full replacement?
- Are you changing roofing material type?
- Structural changes to roofline?

**Water Heater:**
- Gas or electric?
- Tank or tankless?
- Relocating from current position?

### 10. Clarification Questions
**Issue:** No follow-up for ambiguous answers

**Implementation:**
- Add conditional logic to show follow-up questions
- Example: If "moving plumbing" = yes, ask "How many feet?"
- Use branching logic in wizard

### 11. Contractor Qualification Validation
**Issue:** No validation of contractor qualifications

**Add:**
- License number format validation (FL: XX-12345 format)
- Warning if license field is empty
- Link to FL license verification website
- Educational tooltip about why licensed contractors matter

---

## IMPLEMENTATION PLAN

### Phase 1: Fix Blocking Bugs (Day 1-2)
1. **Fix Next button navigation** - Debug and repair step progression
2. **Add Submit functionality** - Create summary page and save mechanism
3. **Remove placeholder address** - Clear field, add validation

**Success Criteria:**
- User can complete full wizard end-to-end
- Job saves successfully
- All data persists

### Phase 2: Add Missing Fields (Day 3-4)
4. Add contractor information fields
5. Add budget/timeline fields
6. Add building type questions
7. Add permit history questions

**Success Criteria:**
- All critical information captured
- Fields validate correctly
- Data saves with job

### Phase 3: Job-Specific Logic (Day 5-6)
8. Create job type question templates
9. Implement conditional/clarification questions
10. Add contractor license validation

**Success Criteria:**
- Questions adapt to job type
- Follow-up questions appear appropriately
- License validation works

### Phase 4: Polish & Testing (Day 7)
11. Test all job types end-to-end
12. Test validation and error handling
13. Test on mobile
14. Fix any remaining bugs

---

## FILES TO MODIFY/CREATE

**Modify:**
- `src/components/wizard/SmartWizard.tsx` - Fix navigation, add submit
- `src/pages/WizardPage.tsx` - Update step handling
- `src/hooks/useJobs.ts` - Ensure save works properly
- `src/types/index.ts` - Add new field types
- `src/types/database.ts` - Update job schema

**Create:**
- `src/components/wizard/WizardSummary.tsx` - Review page
- `src/components/wizard/steps/ContractorStep.tsx` - Contractor info
- `src/components/wizard/steps/TimelineStep.tsx` - Timeline/budget
- `src/services/validation.ts` - Field validation helpers

---

## TESTING CHECKLIST

- [ ] Can create job for each job type (Roof, Water Heater, Electrical, AC)
- [ ] Next button works on every step
- [ ] Can reach Summary/Submit page
- [ ] Job saves and appears in My Jobs
- [ ] Address validation works
- [ ] All new fields save correctly
- [ ] Validation shows appropriate errors
- [ ] Works on mobile (375px viewport)
- [ ] Build passes

---

## ESTIMATED TIMELINE

- **Phase 1 (Critical Bugs):** 2 days
- **Phase 2 (Missing Fields):** 2 days
- **Phase 3 (Job-Specific Logic):** 2 days
- **Phase 4 (Testing/Polish):** 1 day

**Total: 7 days of focused development**

**Priority:** Phase 1 is CRITICAL - app is unusable without fixes
