define(['backbone'], function(Backbone) {

  return Backbone.View.extend({

    template: _.template( $('#connection-template').html() ),

    workspaceView : null,

    initialize: function( args ) {

      this.model = args.model;

      if (args.isProxy ){
        this.isProxy = true;
      }

      this.workspace = args.workspace;
      this.workspaceView = args.workspaceView;

    },

    delegateEvents: function() {

      Backbone.View.prototype.delegateEvents.apply(this, arguments);

      if (!this.isProxy ){
        this.startId = this.model.get('startNodeId');
        this.endId = this.model.get('endNodeId');
        var nodes = this.workspace.get('nodes');
        this.listenTo( nodes.get(this.endId), 'change:position', this.render);
        this.listenTo( nodes.get(this.startId), 'change:position', this.render);
      }
      
      this.listenTo(this.model, 'change', this.render);

    },

    render: function() {

      this.makeCurveOnce().setAttribute('d', this.template( this.getControlPoints() ));

      if (this.model.get('hidden')) {
        this.el.setAttribute('class','connection collapsed');
      } else {
        this.el.setAttribute('class','connection');
      }
      
      return this;

    },

    curveInit: false, 

    makeCurveOnce: function() {

      if (!this.curveInit) {
        var crv = document.createElementNS('http://www.w3.org/2000/svg','path');
        crv.setAttribute('class','connection');
        this.el = crv;
        this.$el = $(crv);
        this.curveInit = true;
      }
      return this.el;

    },

    // construct the control points for a bezier curve
    getControlPoints: function() {

      if (!this.model.get('startProxy') || !this.model.get('endProxy')) {

        var nodeViews = this.workspaceView.nodeViews
          , startId = this.model.get('startNodeId')
          , endId = this.model.get('endNodeId')
          , startPortIndex = this.model.get('startPortIndex')
          , endPortIndex = this.model.get('endPortIndex')
      }    

      if (!this.model.get('startProxy')) {
        startPos = nodeViews[startId].getPortPosition(startPortIndex, true);
      } else {
        startPos = this.model.get('startProxyPosition');
      }

      if (!this.model.get('endProxy')) {
        endPos = nodeViews[endId].getPortPosition(endPortIndex, false);
      } else {
        endPos = this.model.get('endProxyPosition');
      }

      return {
          aX : startPos[0]
          , aY : startPos[1]
          , bX : startPos[0] + 80
          , bY : startPos[1]
          , dX : endPos[0]
          , dY : endPos[1]
          , cX : endPos[0] - 80
          , cY : endPos[1]
        };
    }

  });

});