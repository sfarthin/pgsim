module.exports = {
  create: function (context) {
    return {
      TemplateLiteral(node) {
        context.report(
          node,
          "Do not use template literals, They don't play nice with swc"
        );
      },
    };
  },
};
