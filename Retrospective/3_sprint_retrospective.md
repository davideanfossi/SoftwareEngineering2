RETROSPECTIVE Sprint 3 (Team 16)
=====================================


- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)
- [technical debt management](#technical-debt-management)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done: `4 stories committed, 4 story done`
- Total points committed vs. done: `19 story points committed, 19 story points done`
- Nr of hours planned vs. spent (as a team): `84h hours planned, 85h 15m hours spent`

### Detailed statistics

| Story  | # Tasks       | Points | Hours est. | Hours actual |
|--------|---------------|--------|------------|--------------|
| _#0_   |   13          |        |     30.5   |     34.5     |
| _5_    |   5           |   3    |     9      |     10       |
| _6_    |   5           |   3    |     10.5   |     11.5     |
| _7_    |   5           |   5    |     12     |     9.25     |       
| _8_    |   7           |   8    |     22     |     20       |       
||
| TOT    |   35          |   27   |     84h    |   85h 15m    |

- Hours per task average, standard deviation (estimate and actual):

      estimated avg = 2,40 h
      actual avg = 2,43 h
      
      estimated standard deviation = 6,36
      actual standard deviation = 6,49 

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1:

      Total task estimation error ratio = 0,015 = 1,5%


## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 6h
  - Total hours spent: 6h
  - Nr of automated unit test cases: 56
  - Coverage (available [here](./../server/test_results/3_sprint_unitTestResult.txt)): 78.26%
- E2E testing:
  - Total hours estimated: 6h
  - Total hours spent: 4h 
- Code review
  - Total hours estimated: 4h
  - Total hours spent: 5h
- Technical Debt management:
  - Total hours estimated: 5h 30m
  - Total hours spent: 6h
  - Hours estimated for remediation by SonarQube: 10h
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: 7h
  - Hours spent on remediation: 6h
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 1.3%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ):
      - reliability: A
      - security: A
      - maintainability: A
      - security review: E

```
Technical Debt Handling Strategy
We decided to focus on solving all 'critical' issues first, also giving them a higher priority on YouTrack.
Then we decided to solve some of the 'major' issues related to the server side, which had the worst rating of maintainability measure (level C).
Finally we spent some time to try to solve some of the security issues (mainly due to privacy reasons connected with the usage of the user geolocation).
```

## ASSESSMENT

- What caused your errors in estimation (if any)?

      The estimation is pretty consistent with the actual time spent and we succesfully delivered all the choosen stories. 

- What lessons did you learn (both positive and negative) in this sprint?

      We need to complete the tasks at least 2 days before the end of the sprint, to be able to merge all the story and solve unexpected problems.

- Which improvement goals set in the previous retrospective were you able to achieve?

      We succesfully obtained a better task estimation. 
      We added more task among the uncategorized ones. 
      We gave more importance to github issues and we organized better with respect to the previous sprint. 
  
- Which ones you were not able to achieve? Why?

      Productivity was pretty high with respect to previous sprints but we could have achieved more. 
      We decided to develop some section dedicated to the user, that were useful to the completeness of the application but not explicitely required.  

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

      Better coordination between members is needed in order to complete the needed task with a little advance with respect to the demo and to have a little margin to handle unexpected problems.
      Productivity improvement. 

- One thing you are proud of as a Team!!

      We succesfully delivered all the committed stories!
