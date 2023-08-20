import axios from 'axios';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { configDotenv } from 'dotenv';

configDotenv();

const apiKey = process.env.API_KEY;

const data = new SlashCommandBuilder()
  .setName('item')
  .setDescription('Search for an item')
  .addStringOption(option =>
    option.setName('item_name')
      .setDescription('Item to look up')
      .setRequired(true),
  );

async function execute(interaction) {
  const item_name = encodeURI(interaction.options.getString('item_name'));
  axios.get(`https://api.dfoneople.com/df/items?wordType=match&apikey=${apiKey}&itemName=${item_name}`)
    .then((res) => {
      if (!res.data.rows[0]) {
        return interaction.editReply('The item doesn\'t exist...');
      }
      console.log(res.data.rows);
      const itemId = res.data.rows[0].itemId;
      const itemType = res.data.rows[0].itemType;
      const itemTypeDetail = res.data.rows[0].itemTypeDetail;
      const itemRarity = res.data.rows[0].itemRarity;
      const requiredLvl = res.data.rows[0].itemAvailableLevel;
      const itemName = res.data.rows[0].itemName;
      axios.get(`https://api.dfoneople.com/df/items/${itemId}?apikey=${apiKey}`)
        .then(async (res2) => {
          const sourceDungeons = res2.data.obtainInfo.dungeon;
          const options = res2.data.growInfo.options;
          const stats = res2.data.itemStatus;
          const bufferOption = res2.data.itemBuff;
          const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Search Item Result')
            .setAuthor({
              name: 'DFO Bot By shawn2013',
            })
            .setDescription(itemName)
            .setFields(
              { name: 'Rarity', value: `${itemRarity}`, inline: true },
              { name: 'Type', value: `${itemType} (${itemTypeDetail})`, inline: true },
              { name: 'Level', value: `${requiredLvl}`, inline: true },
              { name: '\u200B', value: '\u200B' },
              { name: 'Fame', value: `${stats[0].value}` },
              { name: 'Phys. Def.', value: `${stats[1].value}` },
              { name: 'STR', value: `${stats[2].value}` },
              { name: 'VIT', value: `${stats[3].value}` },
              { name: 'INT', value: `${stats[4].value}` },
              { name: 'SPR', value: `${stats[5].value}` },
              { name: '\u200B', value: '\u200B' },
              { name: 'Buff Power (sader only)', value: `${stats[8].value}` },
              { name: 'Buffer option', value: `${bufferOption.explain}` },
            )
            .setFooter({ text: `Item Id: ${itemId}` });
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