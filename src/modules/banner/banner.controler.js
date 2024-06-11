class BannerController{
    bannerCreate=(req, res, next)=>{
        const data =req.body;

        res.json({
            result: data,
            message: "Banner Create",
            meta: null
        });
    };

    bannerList=(req, res) => {
        res.json({
            result: null,
            message: "Banner Listing",
            meta: null
        });

    };

    bannerDetails=(req, res) => {
        const params = req.params;
        const query = req.query;

        res.json({
            result: {
                params: params,
                query: query,
            },
            message: 'Banner details of ' + params.id,
            meta: null

        })

    };

    bannerUpdate = (req, res) => {
        res.json({
            result: {
                Headers: req.header,
            },
            message: "Banner Update",
            meta: null
        });
    };

    bannerDelete=(req, res) => {
        res.json({
            result: null,
            message: "Banner Delete",
            meta: null
        });
    };

}
const bannerControl = new BannerController();
export default bannerControl;