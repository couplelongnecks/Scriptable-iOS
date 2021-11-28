// Main function
let reddit = await redditRequest()
let widget = await createWidget(reddit)
if (config.runsInWidget) {
  Script.setWidget(widget)
} else {
  widget.presentMedium()
}

Script.complete()


async function createWidget(reddit) {
  let appIcon = await loadAppIcon()
  let widget = new ListWidget()
  
  // Background
  let gradient = new LinearGradient()
  gradient.locations = [-0.3, 0.5, 1.3]
  gradient.colors = [
    new Color(“8A2BE2”),
    new Color(“FF4500”),
    new Color(“8A2BE2”)
  ]
  widget.backgroundGradient = gradient
  
  // Show reddit icon and title
  let titleStack = widget.addStack()
  let appIconElement = titleStack.addImage(appIcon)
  appIconElement.imageSize = new Size(20, 20)
  appIconElement.cornerRadius = 4
  appIconElement.url = “https://www.reddit.com”
  titleStack.addSpacer(15)
  let titleElement = titleStack.addText(reddit.name)
  titleElement.textColor = Color.white()
  titleElement.textOpacity = 0.7
  titleElement.font = Font.mediumSystemFont(15)
  titleElement.url = `https://www.reddit.com/r/${reddit.home}`
  widget.addSpacer(5)
  
  // Show Post
  let nameElement = widget.addText(reddit.title)  
  nameElement.minimumScaleFactor = 0.5
  nameElement.textColor = Color.white()
  nameElement.font = Font.systemFont(15)
  widget.addSpacer(1)
  let descriptionElement = widget.addText(reddit.body)
  descriptionElement.minimumScaleFactor = 0.5
  descriptionElement.textColor = Color.white()
  descriptionElement.font = Font.lightMonospacedSystemFont(20)

  if (!config.runsWithSiri) {
    widget.addSpacer(8)
    
    // Add button to open post
    let linkSymbol = SFSymbol.named(“arrow.up.forward”)
    let footerStack = widget.addStack()
    let linkStack = footerStack.addStack()
    linkStack.centerAlignContent()
    linkStack.url = reddit.subURL
    let linkElement = linkStack.addText(“View Post”)
    linkElement.font = Font.mediumSystemFont(10)
    linkElement.textColor = Color.white()
    linkElement.textOpacity = 0.5
    linkStack.addSpacer(3)
    let linkSymbolElement = linkStack.addImage(linkSymbol.image)
    linkSymbolElement.imageSize = new Size(11, 11)
    linkSymbolElement.tintColor = Color.white()
    linkSymbolElement.imageOpacity = 0.5
    footerStack.addSpacer()  
    //Button to go to subreddit
    let subDesc = footerStack.addText(“/u/“ + reddit.author)  
    subDesc.font = Font.mediumSystemFont(10)
    subDesc.textOpacity = 0.5
    
  }
  return widget
}

// JSON as input picks random and gets data
async function redditRequest() {
  let docs = await loadDocs()
  let postNum = docs[“data”][“children”].length
  let randPost = Math.round(Math.random() * postNum)
  let json_single = docs[“data”][“children”][randPost][“data”]
  let title = json_single[“title”]  
  let author = json_single[“author”]
  let body = json_single[“selftext”]
  let name = json_single[“subreddit_name_prefixed”]  
  let home = json_single[“subreddit”]
  let subURL = json_single[“url”]
  return {
    title: title,
    author: author,
    name: name,
    home: home,
    body: body,
    subURL: subURL
  }
}

// Gets the JSON from reddit.
async function loadDocs() {
  var subs = Array(`python`, `programming`, `hacking`, `learnprogramming`, `shortcuts`)
  var random_sub = subs[Math.floor(Math.random()*subs.length)];
  
  let url = `http://www.reddit.com/r/${random_sub}.json`
  let req = new Request(url)
  return await req.loadJSON()
}

// Fetches reddit logo to display top left
async function loadAppIcon() {
  let url = “https://www.reddit.com/favicon.ico”
  let req = new Request(url)
  return req.loadImage()
}
