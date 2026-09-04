const fs = require('fs');
let content = fs.readFileSync('src/components/HeroSection.tsx', 'utf8');

content = content.replace(
  `}
      </div>
    </motion.div>
  );
}`,
  `}
        </div>
      </div>
    </motion.div>
  );
}`
);

fs.writeFileSync('src/components/HeroSection.tsx', content);
