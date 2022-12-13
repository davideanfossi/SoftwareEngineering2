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
- Nr of hours planned vs. spent (as a team): `84h hours planned, 83h 15m hours spent`

### Detailed statistics

_Note_: _all the numbers below are computed considering only the new tasks added in this sprint.
In fact we manually counted the real estimated/actual hours for sprint 1 uncompleted stories (HT-2 and HT-3), because YouTrack automatically moved all the tasks uncompleted, from sprint1 to sprint2 board. 
We created new tasks for the uncompleted stories, to better estimate the additional hours needed to complete them, but we also keep the old tasks to not lose all the commits and hours tracked._


| Story  | # Tasks       | Points | Hours est. | Hours actual |
|--------|---------------|--------|------------|--------------|
| _#0_   |   13          |        |     30.5   |     33.5     |
| _5_    |   5           |   3    |     9      |     10       |
| _6_    |   5           |   3    |     10.5   |     11.5     |
| _7_    |   5           |   5    |     12     |     9.25     |       
| _8_    |   7           |   8    |     22     |     19       |       
||
| TOT    |   35          |   27   |     84h    |   83h 15m    |
||

- Hours per task average, standard deviation (estimate and actual):

      estimated avg = 2,40 h
      actual avg = 2,38 h
      
      estimated standard deviation = 6,36 (??) 
      actual standard deviation = 6,49 

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1:

      Total task estimation error ratio = 0,009 = 0,9%


## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 6h
  - Total hours spent: 5h
  - Nr of automated unit test cases: 56
  - Coverage (available [here](./../server/test_results/3_sprint_unitTestResult.txt)): 78.26%
- E2E testing:
  - Total hours estimated: 4h
  - Total hours spent: 4h 
- Code review
  - Total hours estimated: 4h
  - Total hours spent: 5h
  


## ASSESSMENT

- What caused your errors in estimation (if any)?

      The estimation is pretty consistent with the actual time spent and we succesfully delivered all the choosen stories. 

- What lessons did you learn (both positive and negative) in this sprint?

      We understood that the amount of hours needed to complete a task is not the same for every persons. In fact task with same functionality and estimation can be completed in different time by different people. 

- Which improvement goals set in the previous retrospective were you able to achieve?

      We succesfully obtained a better task estimation. 
      We added more task among the uncategorized ones. 
      We gave more importance to github issues and we organized better with respect to the previous sprint. 
  
- Which ones you were not able to achieve? Why?

      Productivity was pretty high with respect to previous sprints but we could have achieved more. We decided to develop some section dedicate to the user that were useful to our mind but not explicitely required yet.  

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

      Better coordination between members is needed in order to complete the needed task with a little advance with respect to the demo. Thus to have a little margin to handle unexpect events.   
      Productivity improvement. 

- One thing you are proud of as a Team!!

      We succesfully delivered all the committed stories!


## TECHNICAL DEBT MANAGEMENT
We decided to manage technicnal debt using the following strategy:
