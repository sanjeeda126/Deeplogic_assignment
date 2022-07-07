const http = require('http');
const https = require('https');

const hostname = '127.0.0.1';
const port = 4001;



const server = http.createServer(async (req, res) => {
    res.statusCode = 200;
    if (req.url === "/getTimesStories") {


      
        let finalJsonObj=[]
        await getRawData().then(data => {
           
            
            var content_holder = "";
            var str1 = '<section class="homepage-section-v2 voices-ls">'
            var str2 = '</section>'
            // var str1 = '<ul><li class="latest-stories__item">'
            // var str2 = '</li></ul>'
            var s = data.substring(data.indexOf(str1) + str1.length);
            s = s.substring(0, s.indexOf(str2));
            
            // console.log(s);

            var str11 = '<ul>'
            var str22 = '</ul>'
            // var str1 = '<ul><li class="latest-stories__item">'
            // var str2 = '</li></ul>'
            var s1 = s.substring(s.indexOf(str11) + str11.length);
            s1 = s1.substring(0, s1.indexOf(str22));
            
            // console.log(s1);
            const regex1 = /<\/h\d+>\s*([^<]*(?:<(?!h\d)[^<]*)*?)\s*(?:<h\d|$)/g;    
            // console.log(Array.from(s1.matchAll(regex1), x => x[1].trim()));
           
            var extractedData=s1
        
            let htmlSplit = s1.split(">")
            let arrayElements = []
            let nodeElement =""
            htmlSplit.forEach((element)=>{  
              if (element.includes("<")) {
                nodeElement = element+">"   
               }else{
                 nodeElement = element
                }

                arrayElements.push(nodeElement)
            })
            // console.log(arrayElements);
            let h3element=""
            let prevelem=""
            let h3elementdata=[]
            let linkdata=[]
            arrayElements.forEach(element => {
                // console.log(element);
            //     const nr = /<h3>(.*?)<\/h3>/g.exec(element);
            // console.log(nr);
            // var newstr = s.substring(element.indexOf("<a href=") + element.length);
            // newstr =newstr.substring(0, newstr.indexOf("\/\""));
            // var requiredString = element.substring(element.indexOf("href=") + 1, element.indexOf("\""));
            if(element.includes('href')){
                // element =element.toString()
                // console.log(element);
            var newstr = element.match("=\"" + "(.*)" + "/")[1].trim()
                linkstr="https://time.com/"+newstr
                // console.log(linkstr);
                linkdata.push(linkstr)
            }
            if(element.includes('<h3')){
                //  console.log("in inclued",element);
              prevelem=element
            }
           
            if(prevelem.includes("<h3")){
                // console.log("asdasd",element);
                h3element+=element       
            }

            if(element.includes('</h3>')){
                // console.log("include done ",h3element);
                prevelem=""
                h3elementdata.push(h3element)
                h3element=""

            }
            // console.log(h3element);
            
            });
            // console.log(h3elementdata.length);
            // console.log(linkdata.length);
            console.log("Adding response");
            
            for (let index = 0; index < h3elementdata.length; index++) {
                let newel = h3elementdata[index];
                let newstr1= newel.match(">" + "(.*)" + "</")[1].trim()
                let link=linkdata[index]
                finalJsonObj.push({
                    title:newstr1,
                    link:link
                })

                
            }
           

        })

        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(finalJsonObj));
        res.end();

    } else {
        res.setHeader('Content-Type', 'text/plain');
        res.end('This is simple test server!\n');
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


var getRawData = async () => {
    return new Promise(async (resolve, reject) => {
        https.get('https://time.com', function(response) {
            let finalData = "";
          
            response.on("data", function (data) {
              finalData += data.toString();
            });
          
            response.on("end", function() {
              console.log(finalData.length);
              resolve(finalData);
            });
          
          });

    
    })

}