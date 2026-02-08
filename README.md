# ZoneGrid Simulator — Visualizing Zone Grouping in Distributed Databases  
*A JunoDB-inspired interactive simulator*

---

## Overview

Distributed databases are designed to survive failures at multiple levels — machines, racks, and even entire availability zones. However, foundational concepts such as **zones, storage groups, sharding and quorum consistency (R/W/N)** are often explained only through static diagrams, making them hard to truly understand.

**ZoneGrid Lab** is an interactive web-based simulator that brings these ideas to life. Inspired by PayPal’s **JunoDB**, the tool visualizes how data is organized across zones and storage groups, and how quorum-based replication behaves under failures.

The goal of this project is to make complex distributed systems concepts **intuitive, visual, and experimentable**.

---

## What Problem This Solves

Traditional explanations of distributed databases typically:

- Use static diagrams that don’t show real failure behavior  
- Assume deep prior knowledge of quorum systems  
- Don’t make it clear *why* certain configurations are resilient  

ZoneGrid Lab addresses this by letting users **see and interact with** a simplified distributed database model, including:

- How data is placed across zones  
- What happens when nodes or zones fail  
- Why certain quorum settings succeed or break  

---

## Core Concepts Modeled

The simulator helps understand:

### 1. Zones as Failure Domains  
- Each **column** in the grid represents an availability zone (AZ).  
- Losing a column simulates an entire zone outage.

### 2. Storage Groups (Replication Units)  
- Each **row** represents a storage group (the unit of replication for a shard).  
- Data is replicated **across zones**, not within a single zone.

### 3. Quorum Consistency (R/W/N)  
Configurable parameters:
- **N** = number of zones (replicas)  
- **W** = write quorum  
- **R** = read quorum  

Valid configurations must satisfy:
- `W + R > N`  
- `W > N/2`  

The simulator enforces these rules and explains why invalid settings are unsafe.

### 4. Failure Tolerance  
Simulate:
- Individual node failures  
- Full zone outages  

The system dynamically shows when reads and writes succeed or fail based on the current quorum.

---

## Features
1. **Configure the system**
   - Choose number of zones (N)  
   - Choose number of storage groups (G)  
   - Set R and W values  

2. **Visualize data placement**
   - See a grid where:
     - Columns = zones  
     - Rows = storage groups  

3. **Simulate failures**
   - Click to disable individual nodes  
   - Click to take down an entire zone  

4. **Run operations**
   - Perform simulated **WRITE(key, value)**  
   - Perform simulated **READ(key)**  
   - Observe success/failure based on quorum rules  

5. **Learn through feedback**
   - The UI explains *why* an operation succeeded or failed in plain English.

---

### Frontend
- **React + TypeScript**
- Component-based UI:
  - `Grid.tsx` — renders zones × storage groups  
  - `Controls.tsx` — sliders for N, G, R, W  
  - `Dashboard.tsx` — shows operation results  

### Core Simulation Logic
Located in `/src/core/`:

- `quorum.ts`  
  - Validates R/W/N rules  
  - Determines whether reads/writes should succeed  

- `mapper.ts`  
  - Maps keys → shards → storage groups  

- `simulator.ts`  
  - Handles failure simulation  
  - Evaluates read/write operations  

---

This project demonstrates practical understanding of:

- Distributed systems  
- Fault tolerance  
- Replication strategies  
- Consistency vs availability tradeoffs  
- Real-world database design principles  



## Acknowledgments

Inspired by **JunoDB**, PayPal’s open-source distributed key-value store.

---

