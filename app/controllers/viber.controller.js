const { post} = require("axios");

const ImageKit = require("imagekit");
const imageKit = require("../config/imageKit.config");
const viber = require("../config/viber.config");

const imagekit = new ImageKit({
    publicKey : imageKit.publicKey,
    privateKey : imageKit.privateKey,
    urlEndpoint : imageKit.urlEndpoint
});

exports.getChannelInfo = async (req, res) => {
    try {
        const response = await post(viber.getAccount,
            {
                "auth_token":"530289b902363b86-75830edf7a719760-33322090f6afe580"
            });
        if(response.status === 200){
            res.status(200).send(response.data);
        } else{
            res.status(500).send({message: 'Failed to get channel info, please try again.'});
        }

    } catch (error) {
        res.status(500).send(error.toString());
    }
}

exports.postContent = async (req, res) => {
    try {
        if(req.file){
            await imagekit.upload({
                file: req.file.buffer,
                fileName :  `${Date.now()}-d-360-${req.file.originalname}`,
                extensions: [
                    {
                        name: "google-auto-tagging",
                        maxTags: 5,
                        minConfidence: 95
                    }
                ]
            }).then(async response => {
                res.status(200).send(response);

                const viberRes = await post(viber.createPost,
                    {
                        "auth_token": "530289b902363b86-75830edf7a719760-33322090f6afe580",
                        "from":"3Q4nfH6ZV2bOenMsjVa/hQ==",
                        "type":"picture",
                        "text": req.body.description ,
                        "media": response.url,
                        "thumbnail": response.thumbnailUrl
                    });
                if (viberRes.status === 200) {
                    res.status(200).send(viberRes.data);
                } else {
                    res.status(500).send({message: 'Failed to get channel info, please try again.'});
                }
            }).catch(error => {
                res.status(500).send({
                    message: `Could not upload the file: . ${error}`,
                });
            });
        }
    } catch (error){
        res.status(500).send({
            message: `Could not upload the file: . ${error}`,
        });
    }
}
