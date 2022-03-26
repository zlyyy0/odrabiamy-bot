import { Client, Message, Intents, TextChannel } from 'discord.js';
import { apiSolution, ExerciseDetails } from "./types";
import renderScreenshot from './renderScreeshot'
import fs from 'fs';
import config from './config'
import axios from 'axios';

const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS] });

export function ready(): void {
    console.log(`Logged in as ${client.user.tag} at ${getCurrentTime()}`)
    // get channel id from config
    const file = `${__dirname}/logChannel.json`
    const channel = JSON.parse(fs.readFileSync(file).toString())
    // send message to logging channel
    const channelobj = client.channels.cache.get(channel) as TextChannel
    channelobj.send(`Logged in as ${client.user.tag}`)

    client.user.setPresence({
        activities: [{ 
          name: "making 2a more stupid",
          type: "COMPETING"
        }],
        status: "dnd"
    })
}

client.on('ready', ready);
client.on("messageCreate", async (message: Message) => {
    if (message.author.bot) return;
    if (!config.channels.includes(message.guild!.id)) return;
    if (message.content.startsWith('!loggingchannel')) { await setLoggingChannel(message) }
    if (message.content.includes('odrabiamy.pl')) { await odrabiamyCommand(message) }
    if (message.content.includes('#!')) { await gowno(message) }

    
})

async function setLoggingChannel(message: Message) {
    const channel = message.channel.id
    // create new txt file
    const file = `${__dirname}/logChannel.json`
    // write channel id to file
    fs.writeFileSync(file, JSON.stringify({logChannel: [channel]}))
    // send message to channel
    await message.channel.send(`Logging channel set to ${message.channel}`)
}

async function gowno(message: Message) {
    const snd = String(message).substring(2)
    message.delete()
    await message.channel.send(snd)
}

// main odrabiamy stuff
async function odrabiamyCommand(message: Message) {
    const urlArgs = message.content.split('odrabiamy.pl')[1].split('/');
    const exerciseDetails: ExerciseDetails = {
        bookID: urlArgs[2].split('-')[1],
        page: urlArgs[3].split('-')[1],
        exerciseID: urlArgs[4]?.split('-')[1],
    }
    await message.channel.send('https://emoji.gg/assets/emoji/loading.gif')
    const emoji = message.channel.lastMessage
    const response = await getResponse(exerciseDetails);
    const book_name = response.data.data[0].book.name
    const author = message.author.tag
    console.log(`${author} requested ${message.content} at ${getCurrentTime()}`)
    
    if (message.content.includes('!str')) {
        
        
        for (let num = 0; num < response.data.data.length; num++) {
            let solution = response.data.data[num].solution;
            solution = encodeURI(solution);
            solution = decodeURI(solution);
            const excercise_number = response.data.data[num].number;
            const page_number = exerciseDetails.page
            const solutionScreenshot = await renderScreenshot(solution, excercise_number, page_number, book_name)
            await markAsVisited(response.data.data[num].id, config.odrabiamyAuth);
            if (!solutionScreenshot) break;
            
            await message.channel.send({
                files: [solutionScreenshot],
            })
        }
        
    } else if (message.content.includes('!split')) {
        
        const response = await getResponse(exerciseDetails);
        
        let solution = exerciseDetails.exerciseID
        ? response.data.data.filter((sol: apiSolution) => sol.id.toString() === exerciseDetails.exerciseID)[0].solution
        : response.data.data[0].solution;
        solution = encodeURI(solution);
        solution = decodeURI(solution)
        
        const excercise_number = exerciseDetails.exerciseID 
        ? response.data.data.filter((sol: apiSolution) => sol.id.toString() === exerciseDetails.exerciseID)[0].number
        : response.data.data[0].number;
        
        const page_number = exerciseDetails.page
        
        const subsection = solution.split('<hr>')
        
        for (const element of subsection){
            const solutionScreenshot = await renderScreenshot(element, excercise_number, page_number, book_name)
            await markAsVisited(exerciseDetails.exerciseID ? exerciseDetails.exerciseID : response.data.data[0].id, config.odrabiamyAuth);
            if (!solutionScreenshot) return
            
            await message.channel.send({
                files: [solutionScreenshot],
            })
        }
        
    } else {
        
        const response = await getResponse(exerciseDetails);
        
        let solution = exerciseDetails.exerciseID
        ? response.data.data.filter((sol: apiSolution) => sol.id.toString() === exerciseDetails.exerciseID)[0].solution
        : response.data.data[0].solution;
        
        const excercise_number = exerciseDetails.exerciseID 
        ? response.data.data.filter((sol: apiSolution) => sol.id.toString() === exerciseDetails.exerciseID)[0].number
        : response.data.data[0].number;
        
        const page_number = exerciseDetails.page
        
        const solutionScreenshot = await renderScreenshot(solution, excercise_number, page_number, book_name)
        await markAsVisited(exerciseDetails.exerciseID ? exerciseDetails.exerciseID : response.data.data[0].id, config.odrabiamyAuth);
        if (!solutionScreenshot) return
        
        await message.channel.send({
            files: [solutionScreenshot],
        })
    }
    
    await message.delete() 
    if (emoji) {emoji.delete()}
            
    }
        //things for odrabiamyCommand
        async function getResponse(exerciseDetails: ExerciseDetails) {
            return await axios.request({
                method: 'GET',
                url: `https://odrabiamy.pl/api/v2/exercises/page/premium/${exerciseDetails.page}/${exerciseDetails.bookID}`,
                headers: {
                    'user-agent': 'new_user_agent-huawei-142',
                    Authorization: `Bearer ${config.odrabiamyAuth}`
                }
            });
        }
        
        //things for odrabiamyCommand
        async function markAsVisited(exerciseID: string, authorization: string) {
            axios.request({
                method: 'POST',
                url: `https://odrabiamy.pl/api/v2/exercises/${exerciseID}/visited`,
                headers: {
                    'user-agent': 'new_user_agent-huawei-142',
                    Authorization: `Bearer ${authorization}`,
                }
            })
        }
        
        function getCurrentTime() {
            var date_ob = new Date();
            var day = ("0" + date_ob.getDate()).slice(-2);
            var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            var year = date_ob.getFullYear();
            
            var date = year + "-" + month + "-" + day;
            
            var hours = date_ob.getHours() + 1;
            var minutes = date_ob.getMinutes();
            var seconds = date_ob.getSeconds();
            
            var dateTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    return dateTime
} 


client.login(config.token)