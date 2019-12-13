import axios from 'axios'
import cheerio from 'cheerio'
import config from '../settings/config'

    
    const { scraping: { browsers, findTag, parentTag, attribute }} = config
    //const { urls: {scraper}} = config

    
export default async(job) => {

        const result: Array<object> = []

        await axios({
        url: job.data.url,
        headers:{
            'user-agent': browsers[Math.floor(Math.random()*browsers.length)]
        }}
        )
      .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        //const newsTitle = $('h3');
        
        //const complete = $('a').attr('data-click-id', 'body')
        //console.log(Object.values(newsTitle));

        $(findTag).each( function(i, el){ 
        //$('a').attr('data-click-id', 'body').each( function(i, el){ 
            //Titles[i] = $(el).text()
            result.push({
                title: $(el).text(),
                link: $(el).parents(parentTag).attr(attribute)
            })
        })
        //Object.values(newsTitle).forEach(function(){})
        console.log(result)
        //console.log(complete.text())
     })

      .catch(error => {console.log(error)
        result.push({error})
        }
      );
      
      console.log(result, "RESUTL PARa DEVOLVER")
      return result

}