RETROSPECTIVE Sprint 4 (Team 16)
=====================================


- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)
- [technical debt management](#technical-debt-management)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done: `5 stories committed, 5 story done`
- Total points committed vs. done: `31 story points committed, 31 story points done`
- Nr of hours planned vs. spent (as a team): `92h hours planned, 87h 15m hours spent`

### Detailed statistics

| Story  | # Tasks       | Points | Hours est. | Hours actual |
|--------|---------------|--------|------------|--------------|
| _#0_   |   12          |        |     29     |     24       |
| _17_   |   6           |   8    |     10     |     15.25    |
| _18_   |   5           |   5    |     7      |     6.5      |
| _34_   |   5           |   5    |     9      |     10       |       
| _9_    |   5           |   5    |     12     |     16       |       
| _33_   |   5           |   8    |     15     |     15.5     |       
||
| TOT    |   38          |   31   |     92h    |   87h 15m    |

- Hours per task average, standard deviation (estimate and actual):

      estimated avg = 2,42 h
      actual avg = 2,30 h
      
      estimated standard deviation = 1,41
      actual standard deviation = 1,46

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1:

      Total task estimation error ratio = 0,055 = 5,4%


## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 8h
  - Total hours spent: 8h 
  - Nr of automated unit test cases: 111
  - Coverage (available [here](./../server/test_results/4_sprint_unitTestResult.txt)): 78.97%
- E2E testing:
  - Total hours estimated: 6h 30m
  - Total hours spent: 6h 30m 
- Code review
  - Total hours estimated: 3h
  - Total hours spent: 3h 30m
- Technical Debt management:
  - Total hours estimated: 2h
  - Total hours spent: 2h 30m
  - Hours estimated for remediation by SonarQube: 5d
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: 3h
  - Hours spent on remediation: 2h 30m 
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 0.9%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ):
      - reliability: A
      - security: A
      - maintainability: A
      - security review: A

```
Technical Debt Handling Strategy
We decided to focus on solving some 'Major' issues first.
Then we decided to solve some of the 'Minor' issues.
Having spent a lot of time during the last sprint on technical debt management, for this sprint we decided to focus on developement first and face TD only after the merge. That is also because having undestood the main issues found by sonarcloud on the last sprint we were able to avoid those issues writing new code. 
In fact it is possible to see that the slope in the Activity tab (in Sonarcloud) of the last sprint is lower with respect to the one of the previous sprint. 
```

## ASSESSMENT

- What caused your errors in estimation (if any)?

      The estimation is pretty consistent with the actual time spent and we succesfully delivered all the choosen stories. 

- What lessons did you learn (both positive and negative) in this sprint?

      We still need to complete the tasks some time before the end of the sprint, to be able to merge all the story and solve unexpected problems.
      Also we should dedicate some more time to address more the overall technical debt.

- Which improvement goals set in the previous retrospective were you able to achieve?

      We were able to complete a higer number of story points with respect to previous sprints.
  
- Which ones you were not able to achieve? Why?

      During this sprint we had some coordination and communication issues, mainly due to the fact that some member of the group started working before the Christmas break, while others started after.

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

      More regular update about the different tasks status between members. 
      Better task division to handle technical debt. 

- One thing you are proud of as a Team!!

      We succesfully delivered all the committed stories and raised the total story point delivered. We're also proud of the final product we successfully delivered.  
