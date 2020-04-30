const PackageModel = require("../models/PackageModel");

module.exports = {
  create: (req, res) => {
    let package = new PackageModel(req.body);
    package
      .save()
      .then((result) => {
        res.json({ success: true, result: result });
      })
      .catch((err) => {
        res.json({ success: false, result: err });
      });
  },

  retrive: (req, res) => {
    PackageModel.find()
      .then((result) => {
        if (!result) res.json({ success: false, result: "No results found" });

        res.json({ success: true, result: result });
      })
      .catch((err) => res.json({ success: false, result: result }));
  },

  delete: (req, res) => {
    PackageModel.remove({ _id: req.body._id })
      .then((result) => {
        if (!result)
          res.json({
            success: false,
            result: "No package was found with this id",
          });
        res.json({ success: true, result: result });
      })
      .catch((err) => res.json({ success: false, result: err }));
  },

  retriveBestDelivery: async (req, res) => {
    Date.prototype.addHours = function (h) {
      this.setHours(this.getHours() + h);
      return this;
    };
    var datetime = new Date().toISOString();
    var query = { date: { $lte: datetime } };
    var location = req.body;

    try {
      var deliveries = await PackageModel.find(query);

      var delivery = deliveries.sort((d, g) => {
        var a = d.sender.lat - location.lat;
        var b = d.sender.lng - location.lng;
        var x = Math.sqrt(a * a + b * b);
        a = g.sender.lat - location.lat;
        b = g.sender.lng - location.lng;
        var y = Math.sqrt(a * a + b * b);
        return x - y;
      })[0];
      console.log(delivery);
      res.json({ success: true, result: delivery });
    } catch (err) {
      res.json({ success: false, result: err });
    }
  },
};
