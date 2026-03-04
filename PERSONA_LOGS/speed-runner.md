# Persona Log: The Speed-Runner

## Initial Impression (Turn 1)

**First thought:** I just need to know what permits to get so I can schedule my contractor. If this is fast, great. If not, I'll just call the county.

**Immediate assessment:**
- Homepage loads fast ✓
- Big buttons for common jobs ✓
- "Takes about 3-5 minutes" - acceptable time investment
- Two paths: wizard or AI chat. I'll try wizard first.

**What I skipped:**
- Didn't read "What You'll Need" section
- Ignored "Before you start" list
- Didn't look at Help section
- Didn't check if this is official or not

**Friction:** Design is clean but there's a lot of scrolling text before I can do anything. Mobile users might be annoyed.

## Primary Flow Exploration (Turn 2)

**Started Water Heater job:**
**Completion time so far: ~30 seconds**

**What worked:**
- Clicked Water Heater from dropdown
- Saw time/cost estimate immediately
- Four-step process is visible

**What slowed me down:**
- Had to click dropdown, then scroll to find Water Heater
- Would prefer tap Water Heater directly from homepage (like the "Popular Jobs" buttons)
- "Next" button didn't advance - had to figure out I needed to wait/pick a location first?

**Current state:**
- Selected job type ✓
- Need to enter location (didn't get there yet)

**Frustration:** The wizard advances by field completion, not button clicks. I want to click "Next" to move forward but it's either disabled or non-responsive.

## AI Assistant Try (Turn 3)

**Switched to AI chat:**
**Completion so far: ~45 seconds**

**Why I switched:**
- Wizard felt sticky/clunky
- AI chat promises "simple words" which sounds faster
- Can type "new water heater in my garage" and be done

**What works:**
- Text field is ready for input
- Can upload photos directly (didn't try, but option is there)
- Go to wizard button if AI doesn't work out

**What annoyed me:**
- Send button is disabled until I type - why? Just let me type and hit enter
- No auto-focus on the chat input, had to click it manually
- Address field has fake placeholder text that looks real ("123 Main St...") - almost used it without replacing

**What I did:**
- Typed: "need permit for new 50 gallon water heater in garage, st pete"
- Hit Send
- Waited for response...

**Problem:** Response wasn't instant. No loading indicator visible. Not sure if it's working or broken.

**Bailed on AI, went back to wizard.**

## Final Attempt & Discovery (Turn 4)

**Back to wizard, powered through:**

**What I learned:**
- Job type selection works
- Location step needs address + jurisdiction
- But couldn't actually complete because Account page is 404
- Can't submit without account, can't create account

**Kill switch hit:**
- Account is required for checklist generation
- Account page doesn't exist
- Dead end after 2 minutes of effort

**Alternative - Help Section:**
- Scanned quickly for quick answers
- FAQ looked promising but clicking just redirects to AI chat
- Not actual quick answers
- Video tutorials probably require watching (too slow)

**What I found that was useful:**
- County phone number: 727-464-3207
- Called instead - got answer in 45 seconds

## Final Assessment

**Total time spent:** 3 minutes before hitting dead end
**Result:** No checklist generated, no useful output
**Current status:** Will call county and/or go direct to their portal

**What worked:**
- Fast initial load
- Clear UI, not confusing
- Multiple paths offered (wizard vs AI)

**What killed the flow:**
1. **Account page 404** - BREAKS THE ENTIRE APP. Can't complete any job without it.
2. Stick wizard navigation - can't just click Next to advance
3. AI chat response time unclear - felt broken
4. FAQ doesn't answer, just redirects to AI

**What I wanted:**
- Guest checkout / email me the checklist option
- Faster wizard - tap through, less reading
- Quick FAQ answers without leaving the page
- Progress saved to local storage so I don't lose it

**The irony:** The homepage said "Takes about 3-5 minutes" and I spent 3 minutes to hit a 404 error.

**Would I use it?** Not in current state. Account page must exist and allow completion without creating full account, OR create account on final step only.

**Quick fix suggestion:** Email-based checklist delivery. Let me enter my email, get the checklist, decide if I want an account later. Don't gate the core utility behind a broken account system.
