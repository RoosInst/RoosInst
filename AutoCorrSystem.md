# Auto Correlation System (ACS)

## Intro

ACS compares Control Unit (CU) per Cassini Test Exec to validate setup prior to production lot testing.  CU Data is collected, exported as CSV and limits manipulated (offline) for each test.

## Sequence Diagrams

### Setup (Steps 1-3)

```mermaid
sequenceDiagram
    Cassini--).CSV: Run Exec with CU, 1) Export CSV & Set Limits
    .CSV--)ACS: 2) Modify CU TestData and Limits
    Cassini--)Guru: 3) Save Exec with "Bias Control" Enabled
    ACS--)Guru: Import CU Test Data to Save ACSdata, Title=ExecName
    ACS--)Guru: ACSmsgLog Saved, Expires 30 days
```

### Run (Step 4)

```mermaid
sequenceDiagram
    Guru->>Cassini: 4) Run Exec w/ACS
    Note over Cassini: Compiles Exec to Pepare Run
    opt Check ACSdataSave Not Found
      Cassini->>ACS: Launch ACS
      ACS--)Guru: ACSmsgLog Saved at Launch
      activate ACS
      Note over ACS: ACS Select Exec
      Guru->>ACS: Loads CU data based on Exec Name
      loop Every CU Device
      Note over ACS: Select CU, Site/Arm
         ACS->>Cassini: Runs with CU Limits (2 Pass, 2 Fail)
      end
      Note over ACS: Save Correlation
     ACS->>Guru: ACSdataSave (STDF, CSV), Expires in 12 hrs
     ACS--)Guru: ACSmsgLog, Expires 30 days
    end
      Guru->>Cassini: Load ACSdataSave
      Note over Cassini: Start | Stop (Normal Testing) 
      Cassini->>Guru: STDF RiDatalog
```

### Copy STDF Datalog

```mermaid
sequenceDiagram
    Guru->>Guru Agent: MatchOn ACS STDF datalog
    Guru Agent->>.STDF: Copy's STDF to processor
```
