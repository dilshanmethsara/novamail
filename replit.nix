{ pkgs }: {
  deps = [
    pkgs.nodejs_20
    pkgs.nodePackages.npm
    pkgs.nodePackages.typescript
  ];
  env = {
    NODE_ENV = "production";
    PORT = "5000";
    REPLIT_URL = "${REPL_SLUG}.${REPL_OWNER}.repl.co";
  };
}
