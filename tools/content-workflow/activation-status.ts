export type RuntimeAgent={readonly name:string;readonly mode:string;readonly hidden?:boolean};
export type ActivationRegistry={
  readonly commands:readonly string[];
  readonly agents:readonly RuntimeAgent[];
  readonly skills:readonly string[];
  readonly defaultAgent:string|null;
};
export function activationStatus(registry:ActivationRegistry){
  const required=['atlas-improve','atlas-review','atlas-resume'];
  const commands=required.filter(name=>registry.commands.includes(name));
  const reviewer=registry.agents.some(agent=>agent.name==='atlas-reviewer');
  const skill=registry.skills.includes('atlas-workflow');
  const defaultAgent=registry.defaultAgent??'build';
  const defaultAgentValid=registry.agents.some(agent=>agent.name===defaultAgent&&!agent.hidden&&(agent.mode==='primary'||agent.mode==='all'));
  const registered=commands.length===required.length&&reviewer&&skill;
  return {ready:registered&&defaultAgentValid,registered,commands,reviewer,skill,defaultAgent,defaultAgentValid,executionVerified:false};
}
