# Mobile Sort UX Enhancement - Implementation Plan

## Overview
Implement mobile-specific sort controls in filter drawer while maintaining desktop behavior.

**Spec:** See SPEC.md for complete requirements.

---

## Stage 1: Header Mobile Responsiveness

**Goal**: Update header to show "Filter & Sort" text on mobile and hide sort dropdown.

**Success Criteria**:
- [ ] Button text reads "Filter & Sort" on mobile (< 640px)
- [ ] Button text reads "Filter" on desktop (≥ 640px)
- [ ] Sort dropdown hidden on mobile
- [ ] Sort dropdown visible on desktop
- [ ] No layout shifts or visual regressions

**Implementation Steps**:
1. Modify `FilterAndSortHeader.tsx`:
   - Add responsive Tailwind classes to sort dropdown container (`hidden tablet:block`)
   - Add responsive text to filter button:
     ```tsx
     <span className="hidden tablet:inline">Filter</span>
     <span className="tablet:hidden">Filter & Sort</span>
     ```
2. Verify responsive behavior at 640px breakpoint

**Tests**:
- Snapshot test with mobile viewport (<640px)
- Snapshot test with desktop viewport (≥640px)
- Verify button text in both viewports
- Verify sort dropdown visibility in both viewports

**Estimated Complexity**: Low
**Status**: Not Started

---

## Stage 2: Sort Section Component

**Goal**: Create reusable component for rendering sort options as radio buttons.

**Success Criteria**:
- [ ] Component accepts sort options and current value
- [ ] Renders semantic radio button group
- [ ] Calls onChange handler when selection changes
- [ ] Properly styled with theme
- [ ] Accessible (keyboard navigation, ARIA)

**Implementation Steps**:
1. Create `src/components/filter-and-sort/SortRadioGroup.tsx`:
   - Accept props: `options` (React.ReactNode from sortProps), `value`, `onChange`
   - Parse option elements to extract value/label pairs
   - Render fieldset with radio inputs
   - Style radio buttons consistently with theme
   - Handle onChange to call parent handler

2. Consider component structure:
   ```tsx
   type SortRadioGroupProps = {
     currentValue: string;
     onChange: (value: string) => void;
     options: React.ReactNode; // <option> elements from sort components
   };
   ```

**Alternative Approach**:
Instead of creating a separate component, could inline the radio group directly in FilterAndSortContainer. This might be simpler since we need to extract option values from React.ReactNode.

**Decision**: Start with inline implementation in Stage 3, extract to component only if it becomes too complex.

**Tests**:
- (Defer until Stage 3 if using inline approach)
- Test radio group renders all options
- Test current value is checked
- Test onChange fires with correct value
- Test keyboard navigation

**Estimated Complexity**: Medium
**Status**: Not Started

---

## Stage 3: Drawer Sort Section Integration

**Goal**: Add "Sort by" section to filter drawer on mobile only.

**Success Criteria**:
- [ ] Sort section visible in drawer on mobile (<640px)
- [ ] Sort section hidden in drawer on desktop (≥640px)
- [ ] Sort section positioned after AppliedFilters
- [ ] Current sort option pre-selected
- [ ] Selecting option updates sort immediately
- [ ] Drawer remains open after sort selection
- [ ] List scrolls to top on sort change

**Implementation Steps**:
1. Modify `FilterAndSortContainer.tsx`:
   - Add sort section after AppliedFilters (line ~267, after `{filters}`)
   - Wrap in responsive div: `className="tablet:hidden"`
   - Use `FilterSection` component with title "Sort by"
   - Parse `sortProps.sortOptions` (React.ReactNode) to extract options
   - Render radio inputs inside FilterSection
   - Connect radio onChange to `sortProps.onSortChange`

2. Option parsing approach:
   ```tsx
   // Extract option values/labels from React.ReactNode
   const sortOptionsList = React.Children.toArray(sortProps.sortOptions)
     .filter((child): child is React.ReactElement =>
       React.isValidElement(child) && child.type === 'option'
     )
     .map(option => ({
       value: option.props.value as string,
       label: option.props.children as string,
     }));
   ```

3. Radio group rendering:
   ```tsx
   <FilterSection title="Sort by" defaultOpen={true}>
     <div className="space-y-3">
       {sortOptionsList.map((option) => (
         <label key={option.value} className="flex items-center gap-3">
           <input
             type="radio"
             name="sort"
             value={option.value}
             checked={sortProps.currentSortValue === option.value}
             onChange={(e) => {
               // Create synthetic event matching select's onChange signature
               const syntheticEvent = {
                 ...e,
                 target: { ...e.target, value: e.target.value },
               } as React.ChangeEvent<HTMLSelectElement>;
               sortProps.onSortChange(syntheticEvent);
             }}
             className="..." // Style appropriately
           />
           <span>{option.label}</span>
         </label>
       ))}
     </div>
   </FilterSection>
   ```

**Potential Issues**:
- `onSortChange` expects `ChangeEvent<HTMLSelectElement>`, but radios fire `ChangeEvent<HTMLInputElement>`
- May need to create synthetic event or add type casting
- Consider if we should update the SortProps type to be more generic

**Tests**:
- Snapshot test with mobile viewport showing sort section
- Snapshot test with desktop viewport hiding sort section
- Test that sort section appears after AppliedFilters
- Test radio selection triggers onSortChange
- Test current value is checked
- Test all sort options render correctly

**Estimated Complexity**: Medium
**Status**: Not Started

---

## Stage 4: Radio Button Styling

**Goal**: Style radio buttons to match the site's design system.

**Success Criteria**:
- [ ] Radio buttons match theme colors
- [ ] Hover states work
- [ ] Selected state clearly visible
- [ ] Consistent spacing and typography
- [ ] Touch targets meet mobile accessibility standards (44px minimum)

**Implementation Steps**:
1. Review existing form element styles in codebase
2. Apply consistent classes to radio inputs and labels
3. Consider custom radio button styling:
   - Hidden native radio with custom indicator
   - Or styled native radio with accent colors
4. Test on both light and dark themes (site uses light-dark())

**Reference Styles**:
Look at existing checkbox/input styling in other filter components for consistency.

**Tests**:
- Visual regression tests (screenshots)
- Test hover states
- Test selected states
- Test focus states for accessibility

**Estimated Complexity**: Low
**Status**: Not Started

---

## Stage 5: Testing & Refinement

**Goal**: Comprehensive testing and edge case handling.

**Success Criteria**:
- [ ] All unit tests pass
- [ ] Snapshot tests updated
- [ ] Manual testing on mobile device
- [ ] Manual testing on desktop
- [ ] Keyboard navigation works
- [ ] Screen reader announces sort changes
- [ ] No console errors or warnings
- [ ] Smooth transitions and interactions

**Implementation Steps**:
1. Run full test suite: `npm run test`
2. Update snapshot tests for all affected components
3. Manual testing:
   - Test on actual mobile device (iOS/Android)
   - Test on desktop browser
   - Test at breakpoint (640px exactly)
   - Test all sort options
   - Test combining sort + filter changes
   - Test keyboard navigation (Tab, Space, Enter, Arrow keys)
   - Test with screen reader (VoiceOver/NVDA)

4. Performance check:
   - Verify no unnecessary re-renders
   - Check drawer animation smoothness
   - Verify scroll-to-top behavior

5. Edge cases:
   - What if no sort options provided?
   - What if only one sort option?
   - Rapid sort changes
   - Sort change while filters pending

**Tests**:
- All existing tests still pass
- New tests added for mobile sort section
- Snapshot tests updated
- Accessibility tests pass

**Estimated Complexity**: Medium
**Status**: Not Started

---

## Stage 6: Documentation & Cleanup

**Goal**: Update documentation and remove implementation plan.

**Success Criteria**:
- [ ] Add AIDEV-NOTE comments for spec-critical code
- [ ] Update component documentation
- [ ] Remove SPEC.md and IMPLEMENTATION_PLAN.md
- [ ] No commented-out code
- [ ] No debug console.logs
- [ ] Code follows project conventions

**Implementation Steps**:
1. Add AIDEV-NOTE comments:
   - In FilterAndSortHeader: Note responsive button text
   - In FilterAndSortContainer: Note mobile-only sort section
   - Reference SPEC requirements in comments

2. Update component JSDoc:
   - Document mobile vs desktop behavior
   - Note sort section placement in drawer

3. Final cleanup:
   - Remove any temporary code
   - Remove console.logs
   - Verify imports are clean
   - Run `npm run lint:fix` and `npm run format:fix`

4. Delete implementation files:
   ```bash
   rm SPEC.md IMPLEMENTATION_PLAN.md
   ```

**Tests**:
- `npm run lint` passes
- `npm run format` passes
- `npm run check` passes (TypeScript)

**Estimated Complexity**: Low
**Status**: Not Started

---

## Rollback Plan

If issues arise during implementation:

1. **Stage 1 issues**: Revert header changes, maintain original behavior
2. **Stage 2-3 issues**: Hide sort section with `hidden` class, revert to header-only sort
3. **Stage 4 issues**: Use unstyled native radio buttons temporarily
4. **Stage 5 issues**: Fix tests or revert to previous stage

All changes are additive (responsive classes, new drawer section), so reverting should be straightforward.

---

## Definition of Done

- [ ] All 6 stages completed
- [ ] All tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run check`)
- [ ] Formatting passes (`npm run format`)
- [ ] Manual testing completed on mobile and desktop
- [ ] No accessibility regressions
- [ ] Code reviewed against SPEC.md requirements
- [ ] AIDEV-NOTE comments added
- [ ] SPEC.md and IMPLEMENTATION_PLAN.md deleted

---

## Notes

**Assumptions**:
- Tailwind `tablet:` breakpoint is 640px (verified in tailwind.css)
- Sort options are provided as `<option>` elements in `sortProps.sortOptions`
- Existing `onSortChange` handler works with synthetic events

**Dependencies**:
- No new dependencies required
- Uses existing FilterSection component
- Uses existing Tailwind theme

**Risks**:
- Low risk: Changes are responsive-only, desktop behavior unchanged
- Medium risk: Radio button event handling might need adjustment for type compatibility
- Low risk: Parsing React.ReactNode for options might be fragile if sort components change

**Browser Support**:
- Same as Tailwind CSS (per CLAUDE.md)
- Radio buttons have universal support
- Responsive classes widely supported
