import { ZoneGridSimulator } from "./Simulator";

const sim = new ZoneGridSimulator({
  zones: 5,
  groups: 3,
  quorum: { n: 5, r: 3, w: 3 },
  placement: { numGroups: 3, numShards: 64 },
});

console.log(sim.write("user:123", "hello"));
sim.setZone(2, "DOWN"); // simulate zone outage
console.log(sim.read("user:123"));
sim.setZone(1, "DOWN"); // take down another zone
console.log(sim.read("user:123")); // may fail if < R replicas alive in that row
sim.setZone(3, "DOWN"); // 3 zones down total
console.log(sim.read("user:123"));
