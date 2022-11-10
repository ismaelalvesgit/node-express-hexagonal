import { Commands, AddCommands, Container } from "@type/core";
import * as ContactJob  from "./contact";
import {
    createContainer as createCoreContainer,
  } from "../core/container";
  
import {
    createContainer as createInfraContainer,
} from "../infrastructure/container";
import { env } from "@util/env";

const infraContainer = createInfraContainer(env.get());
const coreContainer = createCoreContainer(infraContainer);
const commands = [] as Array<AddCommands>;

commands.push(ContactJob);

const commandsExec = (container?: Container) =>{
    return commands.map((exec)=>{
       const { name, job, deadline, group, schedule  } = exec;
       const command = async ()=>{
           await new job({coreContainer: container || coreContainer}).run();
           return `Execute ${name} done`;
       };
   
       return {
           name,
           command,
           deadline,
           group, 
           schedule
       } as Commands;
   });
};

export default commandsExec;