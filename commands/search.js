import axios from 'axios';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { configDotenv } from 'dotenv';

configDotenv();

const apiKey = process.env.API_KEY;

const data = new SlashCommandBuilder()
  .setName('search')
  .setDescription('Search for a character')
  .addStringOption(option =>
    option.setName('character_name')
      .setDescription('Characeter to look up')
      .setRequired(true),
  )
  .addStringOption(option =>
    option.setName('character_server')
      .setDescription('Character server')
      .setRequired(true)
      .addChoices(
        { name: 'Cain', value: 'cain' },
        { name: 'Sirocco', value: 'sirocco' },
      ),
  );

async function execute(interaction) {
  const charName = interaction.options.getString('character_name');
  const server = interaction.options.getString('character_server');
  axios.get(`https://api.dfoneople.com/df/servers/${server}/characters?characterName=${charName}&wordType=match&apikey=${apiKey}`)
    .then((res) => {
      if (!res.data.rows[0]) {
        return interaction.editReply('The character doesn\'t exist...');
      }
      const charId = res.data.rows[0].characterId;
      const characterName = res.data.rows[0].characterName;
      const level = res.data.rows[0].level;
      const jobName = res.data.rows[0].jobName;
      const jobGrowName = res.data.rows[0].jobGrowName;
      const fame = res.data.rows[0].fame;

      axios.get(`https://api.dfoneople.com/df/servers/${server}/characters/${charId}?apikey=${apiKey}`)
        .then(async (res2) => {
          const exploererClub = res2.data.adventureName;
          const guildName = res2.data.guildName;
          const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Search Character Result')
            .setAuthor({
              name: 'shawn2013',
            })
            .setDescription(charName)
            .addFields(
              { name: 'Explorer Club', value: `${exploererClub}` },
              { name: 'Server', value: `${server === 'cain' ? 'Cain' : 'Sirocco'}` },
              { name: 'Level', value: `${level}` },
              { name: 'Class', value: `${jobName}` },
              { name: 'Advancement', value: `${jobGrowName}` },
              { name: 'Fame', value: `${fame}` },
              { name: 'Guild', value: `${guildName}` },
            )
            .setFooter({ text: `Characeter Id: ${charId}` });
          try {
            await interaction.editReply({ embeds: [embed] });
          } catch (error) {
            console.log(error);
            throw error;
          }
        }).catch(error => {
          throw error;
        });
    }).catch(error => {
      console.log(error);
      throw error;
    });
}

export { data, execute };