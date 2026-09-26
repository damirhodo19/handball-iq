// Coach engine & dashboard i18n messages (EN / HR / DE).
// Keys referenced by lib/coach-i18n.ts and related coach dashboard flows.

export const coachEngineMessagesEn: Record<string, string> = {
  // ── Skill feedback ──────────────────────────────────────────────────────────
  'coach.feedback.noData':
    'Not enough data yet. Complete more sessions and matches to unlock personalized feedback for {skill}.',
  'coach.feedback.trendUp': 'Trending upward by {n} points — keep doing what you are doing.',
  'coach.feedback.trendDown':
    'Trending down by {n} points recently. Revisit the fundamentals of this skill.',

  'coach.feedback.decisionMaking.excellent':
    'Your decision making is excellent. You consistently stay patient and read the situation before committing.',
  'coach.feedback.decisionMaking.good':
    'Your decision making is improving. You usually stay patient before committing, but under pressure you occasionally move too early.',
  'coach.feedback.decisionMaking.developing':
    'Your decision making is developing. You sometimes commit before reading the full situation. Focus on waiting for the shooter\'s final movement.',
  'coach.feedback.decisionMaking.needsWork':
    'Your decision making needs attention. You tend to commit early. Practice delaying your first movement until you see the release cue.',

  'coach.feedback.patience.excellent':
    'Your patience is a clear strength. You hold your position and let the shooter reveal their intention before reacting.',
  'coach.feedback.patience.good':
    'You show good patience in most situations. Under heavy pressure you sometimes shorten your wait — trust your positioning and hold a beat longer.',
  'coach.feedback.patience.developing':
    'Your patience is inconsistent. You sometimes move before reading the shooter. Practice holding your stance until the arm swing begins.',
  'coach.feedback.patience.needsWork':
    'Patience is your biggest opportunity. You frequently commit before the shooter reveals their plan. Slow down and wait for the release cue.',

  'coach.feedback.readingShooter.excellent':
    'You consistently recognize body position well. Continue delaying your first movement and trusting what you see.',
  'coach.feedback.readingShooter.good':
    'You read the shooter well in most situations. Occasionally you react to a fake — confirm the arm position before committing fully.',
  'coach.feedback.readingShooter.developing':
    'Your shooter reading is developing. You sometimes react to early body cues instead of waiting for the final arm position. Focus on the release point.',
  'coach.feedback.readingShooter.needsWork':
    'Reading the shooter needs work. You often react to initial movement rather than the final release. Practice tracking the wrist and elbow at the point of release.',

  'coach.feedback.fastBreak.excellent':
    'Your fast break decisions are sharp. You control your advance and read the attacker\'s speed correctly.',
  'coach.feedback.fastBreak.good':
    'You handle fast breaks well. Occasionally you over-advance — remember to stop at five metres and set your position.',
  'coach.feedback.fastBreak.developing':
    'Fast break performance is mixed. You sometimes rush out too early or stay too deep. Practice controlled advancement to the five-metre line.',
  'coach.feedback.fastBreak.needsWork':
    'Fast breaks are a weakness. You tend to either rush out or stay frozen. Work on a controlled, steady advance that shortens the angle without over-committing.',

  'coach.feedback.wingSituations.excellent':
    'Your wing shot handling is excellent. You hold your shape and let the difficult angle work in your favour.',
  'coach.feedback.wingSituations.good':
    'You handle wing situations well. Sometimes you commit to the near post early — hold your position until the release.',
  'coach.feedback.wingSituations.developing':
    'Wing situations are inconsistent. You sometimes guess a corner. Trust the angle and react to the actual shot.',
  'coach.feedback.wingSituations.needsWork':
    'Wing shots are a weakness. You often commit before the release. The angle is already difficult — hold your shape and make yourself large.',

  'coach.feedback.sevenMetre.excellent':
    'Your seven-metre performance is excellent. You stay central and react to the throw rather than guessing.',
  'coach.feedback.sevenMetre.good':
    'You handle seven-metres well. Occasionally you pre-dive based on patterns — use them as context, not certainty.',
  'coach.feedback.sevenMetre.developing':
    'Seven-metre performance is mixed. You sometimes guess a side. Stay central and read the throwing motion.',
  'coach.feedback.sevenMetre.needsWork':
    'Seven-metre throws are a weakness. You frequently pre-dive. Without information, reaction is your best tool — stay central and react.',

  'coach.feedback.pressureHandling.excellent':
    'You perform well under pressure. You maintain your routine and breathing in critical situations.',
  'coach.feedback.pressureHandling.good':
    'You perform well until the final minutes. Focus on slowing your breathing before critical situations and returning to your pre-shot routine.',
  'coach.feedback.pressureHandling.developing':
    'Pressure affects your decision making. You tend to speed up under pressure. Practice your breathing routine and treat every shot as shot one.',
  'coach.feedback.pressureHandling.needsWork':
    'Pressure handling needs significant work. You lose your structure in critical moments. Build a reset routine: one breath, one cue word, one save.',

  'coach.feedback.consistency.excellent':
    'Your consistency is excellent. You deliver reliable performances across sessions and matches.',
  'coach.feedback.consistency.good':
    'You are mostly consistent. Occasional dips happen — focus on your pre-shot routine to maintain your standard in every situation.',
  'coach.feedback.consistency.developing':
    'Your consistency varies. Some sessions are strong, others drop off. Build a repeatable pre-shot routine to stabilize your level.',
  'coach.feedback.consistency.needsWork':
    'Consistency is a significant gap. Your performance swings widely. Focus on a single repeatable cue before every action to build stability.',

  'coach.feedback.mentalPreparation.excellent':
    'Your mental preparation is excellent. You arrive focused and reset well after setbacks.',
  'coach.feedback.mentalPreparation.good':
    'Your mental preparation is solid. You benefit from pre-match breathing and visualization — keep doing it consistently.',
  'coach.feedback.mentalPreparation.developing':
    'Mental preparation is developing. You sometimes skip your routine. Complete your pre-match preparation more consistently to build readiness.',
  'coach.feedback.mentalPreparation.needsWork':
    'Mental preparation needs attention. You rarely complete pre-match routines. Start with a quick breathing exercise before every match.',

  // ── Weekly report ───────────────────────────────────────────────────────────
  'coach.weekly.improvementUp':
    '{skill} improved by {n} points compared to your previous sessions.',
  'coach.weekly.improvementStable':
    'Your skills are holding steady. No major jumps this week, but consistency is valuable.',
  'coach.weekly.weaknessLow':
    '{skill} is your lowest area at {score}%. This is where the biggest gains are available.',
  'coach.weekly.weaknessModerate':
    '{skill} is your lowest area at {score}%, which is still a reasonable level. Small improvements here will round out your game.',
  'coach.weekly.recFocusWeak':
    'Focus next week on {skill}. Add two short sessions targeting this area, and complete a Match Day Preparation before your next game.',
  'coach.weekly.recTrendUp':
    'You are trending upward. Continue your current routine and add one extra session targeting {skill} to push your overall score higher.',
  'coach.weekly.recTrendDown':
    'Your recent trend is slightly down. Revisit the fundamentals — complete a Match Day Preparation and focus on your breathing routine before the next match.',
  'coach.weekly.recStable':
    'Your performance is stable. To break through, target {skill} with two focused sessions and complete a post-match reflection after your next game.',
  'coach.weekly.allSkillsStable': 'All skills are stable',

  // ── Training plan ───────────────────────────────────────────────────────────
  'coach.plan.focus.decisionMaking': 'Decision Making',
  'coach.plan.desc.decisionMaking':
    'Review scenario cards and practice reading the full situation before committing.',
  'coach.plan.focus.patience': 'Patience Training',
  'coach.plan.desc.patience':
    'Practice holding your stance. Wait for the shooter\'s final movement before reacting.',
  'coach.plan.focus.readingShooter': 'Reading the Shooter',
  'coach.plan.desc.readingShooter':
    'Study body position, shoulder angle and arm swing cues. Delay your first movement.',
  'coach.plan.focus.fastBreak': 'Fast Break Decisions',
  'coach.plan.desc.fastBreak':
    'Practice controlled advancement to the five-metre line and reading the attacker\'s speed.',
  'coach.plan.focus.wingSituations': 'Wing Situations',
  'coach.plan.desc.wingSituations':
    'Train your positioning on wing shots. Hold your shape and let the angle work for you.',
  'coach.plan.focus.sevenMetre': '7m Throws',
  'coach.plan.desc.sevenMetre':
    'Practice staying central on seven-metre throws. React to the throwing motion, do not guess.',
  'coach.plan.focus.pressureHandling': 'Pressure Situations',
  'coach.plan.desc.pressureHandling':
    'Simulate late-game pressure. Practice your breathing routine before every critical save.',
  'coach.plan.focus.consistency': 'Consistency Training',
  'coach.plan.desc.consistency':
    'Repeat your pre-shot routine before every action. Build a single reliable cue word.',
  'coach.plan.focus.mentalPreparation': 'Mental Preparation',
  'coach.plan.desc.mentalPreparation':
    'Complete a Match Day Preparation session. Breathing, visualization and tactical review.',
  'coach.plan.desc.pressureFriday':
    'Simulate high-pressure scenarios. Practice your breathing and reset routine before critical saves.',
  'coach.plan.focus.matchPrep': 'Match Preparation',
  'coach.plan.desc.matchPrep':
    'Complete a full Match Day Preparation. Breathing, mental reset, visualization and tactical scenarios.',
  'coach.plan.focus.recovery': 'Recovery and Review',
  'coach.plan.desc.recovery':
    'Light review of the week. Reflect on what improved and set one focus for next week.',

  // ── Player types ────────────────────────────────────────────────────────────
  'coach.playerType.calmReader.name': 'Calm Reader',
  'coach.playerType.calmReader.description':
    'You are a Calm Reader. You stay patient, read the shooter well and rarely commit early. Your composure is a strength — use it while improving your speed on fast breaks.',
  'coach.playerType.calmReader.focus':
    'Improve fast break reaction speed while maintaining your patient reading style.',
  'coach.playerType.calmReader.strength.0': 'Patience before committing',
  'coach.playerType.calmReader.strength.1': 'Reading shooter body position',
  'coach.playerType.calmReader.strength.2': 'Stays composed under pressure',
  'coach.playerType.calmReader.risk.0': 'May concede by being too passive on quick attacks',
  'coach.playerType.calmReader.risk.1': 'Fast break decisions can be slow',

  'coach.playerType.aggressive.name': 'Aggressive Goalkeeper',
  'coach.playerType.aggressive.description':
    'You are an Aggressive Goalkeeper. You advance confidently and thrive under pressure. Your risk is over-committing — add patience to your set-piece play.',
  'coach.playerType.aggressive.focus':
    'Balance your aggression with more patience. Wait for the release cue on set-piece attacks.',
  'coach.playerType.aggressive.strength.0': 'Fast break decisions',
  'coach.playerType.aggressive.strength.1': 'Confidence under pressure',
  'coach.playerType.aggressive.strength.2': 'Proactive positioning',
  'coach.playerType.aggressive.risk.0': 'Sometimes over-commits',
  'coach.playerType.aggressive.risk.1': 'Can be beaten by patient shooters who wait you out',

  'coach.playerType.reactive.name': 'Reactive Goalkeeper',
  'coach.playerType.reactive.description':
    'You are a Reactive Goalkeeper. You rely on reaction and consistency rather than early reads. Strengthen your shooter reading to reach the next level.',
  'coach.playerType.reactive.focus':
    'Improve your reading of the shooter. Focus on shoulder and wrist cues at release.',
  'coach.playerType.reactive.strength.0': 'Consistent performances',
  'coach.playerType.reactive.strength.1': 'Reliable decision making',
  'coach.playerType.reactive.strength.2': 'Strong reaction saves',
  'coach.playerType.reactive.risk.0': 'May struggle against shooters with strong fakes',
  'coach.playerType.reactive.risk.1': 'Reading body cues needs improvement',

  'coach.playerType.pressure.name': 'Pressure Specialist',
  'coach.playerType.pressure.description':
    'You are a Pressure Specialist. You shine in critical moments and prepare mentally better than most. Balance this with consistency in everyday situations.',
  'coach.playerType.pressure.focus':
    'Maintain your pressure performance while improving consistency in routine situations.',
  'coach.playerType.pressure.strength.0': 'Performs in critical moments',
  'coach.playerType.pressure.strength.1': 'Strong mental preparation',
  'coach.playerType.pressure.strength.2': 'Reliable under pressure',
  'coach.playerType.pressure.risk.0': 'May under-invest in routine situations',
  'coach.playerType.pressure.risk.1': 'Can be overly intense in low-pressure moments',

  'coach.playerType.balanced.name': 'Balanced Goalkeeper',
  'coach.playerType.balanced.description':
    'You are a Balanced Goalkeeper. You have no major weaknesses and perform reliably across all situations. To reach the next level, develop one standout strength.',
  'coach.playerType.balanced.focus':
    'Pick one skill to push to excellence. Turn a balanced game into a dominant one.',
  'coach.playerType.balanced.strength.0': 'No major weaknesses',
  'coach.playerType.balanced.strength.1': 'Consistent across all situations',
  'coach.playerType.balanced.strength.2': 'Adaptable to different game scenarios',
  'coach.playerType.balanced.risk.0': 'May lack a standout strength',
  'coach.playerType.balanced.risk.1': 'Can be predictable to experienced shooters',

  'coach.playerType.developing.name': 'Developing Goalkeeper',
  'coach.playerType.developing.description':
    'You are a Developing Goalkeeper. Your profile is still forming. Complete more sessions and matches to unlock a more specific player type and targeted coaching.',
  'coach.playerType.developing.focus':
    'Focus on the fundamentals: patience, reading the shooter and mental preparation. Complete sessions and matches regularly.',
  'coach.playerType.developing.strength.0': 'Building foundations',
  'coach.playerType.developing.strength.1': 'Open to improvement',
  'coach.playerType.developing.strength.2': 'Every session adds data',
  'coach.playerType.developing.risk.0': 'Inconsistent performance',
  'coach.playerType.developing.risk.1': 'Limited experience in some situations',

  // ── Skill category labels ───────────────────────────────────────────────────
  'coach.skill.decisionMaking': 'Decision Making',
  'coach.skill.patience': 'Patience',
  'coach.skill.readingShooter': 'Reading the Shooter',
  'coach.skill.fastBreak': 'Fast Break Performance',
  'coach.skill.wingSituations': 'Wing Situations',
  'coach.skill.sevenMetre': '7m Situations',
  'coach.skill.pressureHandling': 'Pressure Handling',
  'coach.skill.consistency': 'Consistency',
  'coach.skill.mentalPreparation': 'Mental Preparation',

  // ── Coach dashboard calendar ────────────────────────────────────────────────
  'cdCalendar.teamTraining.title': 'Team Training',
  'cdCalendar.teamTraining.desc': 'Tactical drills and set-piece practice',
  'cdCalendar.leagueMatch.title': 'League Match',
  'cdCalendar.leagueMatch.desc': 'vs {opponent} — Home',
  'cdCalendar.recovery.title': 'Recovery Session',
  'cdCalendar.recovery.desc': 'Light recovery and video review',
  'cdCalendar.assignedSession.title': '{sessionType} — {playerName}',
  'cdCalendar.assignedSessionDesc': 'Assigned by {coachName}',
  'cdCalendar.assignedNote.default': 'Complete this session before the due date.',

  // ── Coach dashboard recommendations ─────────────────────────────────────────
  'cdRecommend.issue.wingSituations': 'Player moves too early during wing situations.',
  'cdRecommend.action.wingSituations': 'Assign Wing Session 03.',
  'cdRecommend.issue.pressure': 'Player struggles under pressure.',
  'cdRecommend.action.pressure': 'Complete Pressure Training.',
  'cdRecommend.issue.fastBreak': 'Fast break decisions are inconsistent.',
  'cdRecommend.action.fastBreak': 'Assign Fast Break Session.',
  'cdRecommend.issue.sevenMetre': '7m throw performance needs improvement.',
  'cdRecommend.action.sevenMetre': 'Assign 7m Session.',
  'cdRecommend.issue.mentalPreparation': 'Mental preparation routine is inconsistent.',
  'cdRecommend.action.mentalPreparation': 'Complete Mental Training.',
  'cdRecommend.issue.readingAbility':
    'Reading the shooter needs work — player reacts to early cues.',
  'cdRecommend.action.readingAbility':
    'Assign Match Day Preparation for visualization practice.',
  'cdRecommend.issue.none': 'No critical weaknesses detected.',
  'cdRecommend.action.none':
    'Continue regular training. Assign Match Day Preparation to maintain readiness.',

  // ── Admin scenario categories ───────────────────────────────────────────────
  'category.general': 'General',
  'category.wingShots': 'Wing Shots',
  'category.7mThrows': '7m Throws',
  'category.reading60Defence': 'Reading 6:0 Defence',
  'category.finishingSixMetres': 'Six-Metre Finishes',
  'category.fastBreakTiming': 'Fast Break Timing',
  'category.fastBreak': 'Fast Break',
  'category.powerPlay': 'Power Play',
  'category.shortHanded': 'Short-Handed',
  'category.matchEnding': 'Match Ending',
  'category.decisionMaking': 'Decision Making',
  'category.pivot': 'Pivot',
  'category.pressure': 'Pressure',
  'category.mental': 'Mental',

  'defensiveSystem.60': '6-0',
  'defensiveSystem.51': '5-1',
  'defensiveSystem.42': '4-2',
  'defensiveSystem.321': '3-2-1',
  'defensiveSystem.manToMan': 'Man-to-Man',
  'defensiveSystem.mixed': 'Mixed',

  'cdCalendar.custom.title': '{text}',
  'cdCalendar.custom.description': '{text}',
};

export const coachEngineMessagesHr: Record<string, string> = {
  'coach.feedback.noData':
    "Još nema dovoljno podataka za područje {skill}. Odradi više treninga i utakmica za osobne preporuke.",
  'coach.feedback.trendUp': "Rezultat je porastao za {n} bodova. Nastavi s onim što ti donosi napredak.",
  'coach.feedback.trendDown':
    'U posljednje vrijeme trend pada za {n} bodova. Vrati se na osnove ovog segmenta igre.',

  'coach.feedback.decisionMaking.excellent':
    "Izvrsno donosiš odluke. Strpljivo procjenjuješ situaciju prije nego što reagiraš.",
  'coach.feedback.decisionMaking.good':
    "Sve bolje donosiš odluke. Uglavnom strpljivo čekaš, ali pod pritiskom ponekad reagiraš prerano.",
  'coach.feedback.decisionMaking.developing':
    "Još razvijaš donošenje odluka. Ponekad reagiraš prije nego što procijeniš cijelu situaciju. Vježbaj čekanje završnog pokreta šutera.",
  'coach.feedback.decisionMaking.needsWork':
    "Trebaš poboljšati donošenje odluka. Često reagiraš prerano. Vježbaj odgađanje prve reakcije dok ne prepoznaš šut.",

  'coach.feedback.patience.excellent':
    "Strpljivost ti je jaka strana. Zadržavaš položaj i čekaš da šuter pokaže namjeru prije nego što reagiraš.",
  'coach.feedback.patience.good':
    "U većini situacija dobro čekaš. Pod velikim pritiskom ponekad reagiraš prerano. Vjeruj svom položaju i pričekaj još trenutak.",
  'coach.feedback.patience.developing':
    'Strpljivost ti je neujednačena. Ponekad kreneš prije nego što pročitaš šutera. Vježbaj držanje stava dok ne krene zamah ruke.',
  'coach.feedback.patience.needsWork':
    "Najviše možeš napredovati u strpljivosti. Često reagiraš prije nego što šuter pokaže namjeru. Uspori i pričekaj šut.",

  'coach.feedback.readingShooter.excellent':
    'Dosljedno dobro prepoznaješ položaj tijela. Nastavi odgađati prvu reakciju i vjerovati onome što vidiš.',
  'coach.feedback.readingShooter.good':
    "Uglavnom dobro procjenjuješ šutera. Ponekad reagiraš na fintu. Prati položaj ruke prije nego što kreneš u obranu.",
  'coach.feedback.readingShooter.developing':
    "Još razvijaš procjenu šutera. Ponekad reagiraš na početni pokret tijela umjesto na završni položaj ruke. Prati trenutak izbačaja.",
  'coach.feedback.readingShooter.needsWork':
    'Čitanje šutera traži rad. Često reagiraš na početni pokret umjesto na konačni šut. Vježbaj praćenje zgloba i lakta u trenutku šuta.',

  'coach.feedback.fastBreak.excellent':
    "Dobro odlučuješ u kontranapadu. Kontroliraš izlazak i procjenjuješ brzinu napadača.",
  'coach.feedback.fastBreak.good':
    "Dobro braniš kontranapade. Ponekad izađeš predaleko. Zaustavi se na pet metara i zauzmi stav.",
  'coach.feedback.fastBreak.developing':
    "Obrane kontranapada nisu ti ujednačene. Ponekad izađeš prerano ili ostaneš preblizu golu. Vježbaj kontrolirani izlazak do pet metara.",
  'coach.feedback.fastBreak.needsWork':
    "Trebaš poboljšati obranu kontranapada. Ponekad izađeš prerano, a ponekad ostaneš bez reakcije. Vježbaj stabilan izlazak kojim smanjuješ kut šuta i ostaješ spreman reagirati.",

  'coach.feedback.wingSituations.excellent':
    "Odlično braniš šuteve s krila. Zadržavaš dobar stav i koristiš prednost uskog kuta.",
  'coach.feedback.wingSituations.good':
    "Dobro rješavaš situacije s krila. Ponekad prerano zatvoriš bližu vratnicu: drži poziciju do šuta.",
  'coach.feedback.wingSituations.developing':
    "Obrane s krila nisu ti ujednačene. Ponekad nagađaš kut šuta. Zadrži dobar položaj i reagiraj na loptu.",
  'coach.feedback.wingSituations.needsWork':
    "Trebaš poboljšati obranu s krila. Često reagiraš prije šuta. Napadač ima uzak kut, pa zadrži stav i pokrij što više gola.",

  'coach.feedback.sevenMetre.excellent':
    "Izvrsno braniš sedmerce. Ostaješ u sredini i reagiraš na šut bez nagađanja.",
  'coach.feedback.sevenMetre.good':
    "Dobro braniš sedmerce. Ponekad prerano kreneš na temelju šuterovih navika. Uzmi ih u obzir, ali nemoj ih smatrati sigurnom najavom šuta.",
  'coach.feedback.sevenMetre.developing':
    "Obrane sedmeraca nisu ti ujednačene. Ponekad nagađaš stranu. Ostani u sredini i prati pokret šuta.",
  'coach.feedback.sevenMetre.needsWork':
    "Trebaš poboljšati obranu sedmeraca. Često kreneš prerano. Ako nemaš jasan znak, ostani u sredini i reagiraj na šut.",

  'coach.feedback.pressureHandling.excellent':
    'Dobro igraš pod pritiskom. Održavaš rutinu i disanje u ključnim situacijama.',
  'coach.feedback.pressureHandling.good':
    "Dobro igraš i u završnici. Uspori disanje prije ključnih situacija i vrati se rutini pripreme za šut.",
  'coach.feedback.pressureHandling.developing':
    'Pritisak utječe na tvoje odluke. Pod pritiskom ubrzavaš. Vježbaj disanje i tretiraj svaki šut kao prvi.',
  'coach.feedback.pressureHandling.needsWork':
    "Trebaš znatno poboljšati igru pod pritiskom. U ključnim trenucima gubiš sigurnost u igri. Uvedi rutinu za vraćanje pažnje: jedan udah, jedna riječ, jedna obrana.",

  'coach.feedback.consistency.excellent':
    "Igraš vrlo ujednačeno. Pouzdan si na treninzima i utakmicama.",
  'coach.feedback.consistency.good':
    "Uglavnom igraš ujednačeno. Za manje oscilacija ponavljaj istu rutinu pripreme za šut u svakoj situaciji.",
  'coach.feedback.consistency.developing':
    "Igra ti oscilira. Na nekim treninzima igraš dobro, a na drugima slabije. Uvedi stalnu rutinu pripreme za šut.",
  'coach.feedback.consistency.needsWork':
    "Igra ti znatno oscilira. Prije svake akcije usmjeri se na jedan isti podsjetnik koji ti pomaže da se pripremiš.",

  'coach.feedback.mentalPreparation.excellent':
    "Izvrsno se mentalno pripremaš. Dolaziš usredotočen i nakon pogreške brzo vraćaš pažnju na igru.",
  'coach.feedback.mentalPreparation.good':
    "Dobro se mentalno pripremaš. Koristiš disanje i vizualizaciju prije utakmice. Nastavi redovito.",
  'coach.feedback.mentalPreparation.developing':
    'Mentalna priprema je u razvoju. Ponekad preskočiš rutinu. Redovitije završavaj pripremu prije utakmice.',
  'coach.feedback.mentalPreparation.needsWork':
    'Mentalna priprema traži pažnju. Rijetko završavaš rutinu prije utakmice. Kreni s kratkim vježbama disanja prije svake utakmice.',

  'coach.weekly.improvementUp':
    '{skill} se poboljšao za {n} bodova u odnosu na prethodne treninge.',
  'coach.weekly.improvementStable':
    "Rezultati su ti stabilni. Ovaj tjedan nema velikih pomaka, ali i ujednačenost je vrijedna.",
  'coach.weekly.weaknessLow':
    "Najniži rezultat imaš u području {skill}: {score}%. Tu imaš najviše prostora za napredak.",
  'coach.weekly.weaknessModerate':
    "Najniži rezultat imaš u području {skill}: {score}%, što je i dalje solidno. Mali pomaci u tom području učinit će tvoju igru potpunijom.",
  'coach.weekly.recFocusWeak':
    'Sljedeći tjedan fokusiraj se na {skill}. Dodaj dva kratka treninga za to područje i završi pripremu za utakmicu prije sljedeće utakmice.',
  'coach.weekly.recTrendUp':
    'Trend ti ide prema gore. Nastavi trenutnu rutinu i dodaj jedan dodatni trening za {skill} kako bi podigao ukupni rezultat.',
  'coach.weekly.recTrendDown':
    "Rezultati ti u posljednje vrijeme blago padaju. Vrati se osnovama, dovrši pripremu za utakmicu i posveti pažnju disanju prije sljedećeg nastupa.",
  'coach.weekly.recStable':
    "Rezultati su stabilni. Za daljnji napredak odradi dva ciljana treninga za područje {skill} i osvrt nakon sljedeće utakmice.",
  'coach.weekly.allSkillsStable': 'Sve vještine su stabilne',

  'coach.plan.focus.decisionMaking': 'Donošenje odluka',
  'coach.plan.desc.decisionMaking':
    "Prođi scenarije i vježbaj procjenu cijele situacije prije reakcije.",
  'coach.plan.focus.patience': 'Trening strpljivosti',
  'coach.plan.desc.patience':
    'Vježbaj držanje stava. Čekaj završni pokret šutera prije reakcije.',
  'coach.plan.focus.readingShooter': 'Čitanje šutera',
  'coach.plan.desc.readingShooter':
    'Prouči položaj tijela, kut ramena i signale zamaha. Odgodi prvu reakciju.',
  'coach.plan.focus.fastBreak': 'Odluke u kontranapadu',
  'coach.plan.desc.fastBreak':
    "Vježbaj kontrolirani izlazak do pet metara i procjenu brzine napadača.",
  'coach.plan.focus.wingSituations': 'Situacije s krila',
  'coach.plan.desc.wingSituations':
    "Vježbaj postavljanje pri šutu s krila. Zadrži stav i iskoristi prednost uskog kuta.",
  'coach.plan.focus.sevenMetre': 'Sedmerci',
  'coach.plan.desc.sevenMetre':
    "Pri sedmercima vježbaj zadržavanje u sredini. Reagiraj na pokret šuta bez nagađanja.",
  'coach.plan.focus.pressureHandling': 'Situacije pod pritiskom',
  'coach.plan.desc.pressureHandling':
    'Simuliraj pritisak u završnici. Vježbaj disanje prije svake ključne obrane.',
  'coach.plan.focus.consistency': "Trening ujednačenosti",
  'coach.plan.desc.consistency':
    "Prije svake akcije ponovi rutinu pripreme za šut. Odaberi jednu riječ koja te podsjeća na zadatak.",
  'coach.plan.focus.mentalPreparation': 'Mentalna priprema',
  'coach.plan.desc.mentalPreparation':
    'Završi pripremu za utakmicu. Disanje, vizualizacija i taktički pregled.',
  'coach.plan.desc.pressureFriday':
    "Simuliraj situacije pod velikim pritiskom. Prije ključnih obrana vježbaj disanje i vraćanje pažnje.",
  'coach.plan.focus.matchPrep': 'Priprema za utakmicu',
  'coach.plan.desc.matchPrep':
    "Dovrši pripremu za utakmicu: disanje, vraćanje pažnje, vizualizaciju i taktičke scenarije.",
  'coach.plan.focus.recovery': 'Oporavak i pregled',
  'coach.plan.desc.recovery':
    'Lagani pregled tjedna. Razmisli što se poboljšalo i postavi jedan fokus za sljedeći tjedan.',

  'coach.playerType.calmReader.name': "Smireni procjenitelj igre",
  'coach.playerType.calmReader.description':
    "Smireno procjenjuješ igru. Strpljiv si, dobro pratiš šutera i rijetko reagiraš prerano. Zadrži tu smirenost dok poboljšavaš brzinu reakcije u kontranapadu.",
  'coach.playerType.calmReader.focus':
    'Poboljšaj brzinu reakcije u kontranapadu uz zadržavanje strpljivog stila čitanja.',
  'coach.playerType.calmReader.strength.0': "Strpljivost prije reakcije",
  'coach.playerType.calmReader.strength.1': 'Čitanje položaja tijela šutera',
  'coach.playerType.calmReader.strength.2': 'Smirenost pod pritiskom',
  'coach.playerType.calmReader.risk.0': 'Može primiti gol zbog prevelike pasivnosti u brzim napadima',
  'coach.playerType.calmReader.risk.1': 'Odluke u kontranapadu mogu biti spore',

  'coach.playerType.aggressive.name': 'Agresivni vratar',
  'coach.playerType.aggressive.description':
    "Agresivan si vratar. Samouvjereno izlaziš i dobro igraš pod pritiskom. Ponekad prerano kreneš u obranu šuta. Budi strpljiviji pri šutevima iz igre.",
  'coach.playerType.aggressive.focus':
    "Uz agresivnu igru razvijaj i strpljivost. Pri šutevima iz igre pričekaj jasan znak za reakciju.",
  'coach.playerType.aggressive.strength.0': 'Odluke u kontranapadu',
  'coach.playerType.aggressive.strength.1': 'Samopouzdanje pod pritiskom',
  'coach.playerType.aggressive.strength.2': 'Proaktivno pozicioniranje',
  'coach.playerType.aggressive.risk.0': "Ponekad prerano krene u obranu šuta",
  'coach.playerType.aggressive.risk.1': "Strpljivi šuteri mogu ga nadmudriti",

  'coach.playerType.reactive.name': 'Reaktivni vratar',
  'coach.playerType.reactive.description':
    "Oslanjaš se na reakciju i ujednačenost obrana. Za daljnji napredak razvijaj raniju procjenu šuterove namjere.",
  'coach.playerType.reactive.focus':
    "Poboljšaj procjenu šutera. Pri izbačaju prati rame i ručni zglob.",
  'coach.playerType.reactive.strength.0': "Ujednačena igra",
  'coach.playerType.reactive.strength.1': 'Pouzdano donošenje odluka',
  'coach.playerType.reactive.strength.2': "Brze reakcije pri obrani",
  'coach.playerType.reactive.risk.0': 'Može imati problema protiv šutera s jakim fintama',
  'coach.playerType.reactive.risk.1': 'Čitanje signala tijela treba poboljšati',

  'coach.playerType.pressure.name': 'Specijalist pod pritiskom',
  'coach.playerType.pressure.description':
    'Specijalist si pod pritiskom. Blistiš u ključnim trenucima i mentalno se pripremaš bolje od većine. Uravnoteži to s konstantnošću u rutinskim situacijama.',
  'coach.playerType.pressure.focus':
    "Zadrži kvalitetu igre pod pritiskom i poboljšaj ujednačenost u uobičajenim situacijama.",
  'coach.playerType.pressure.strength.0': 'Igra u ključnim trenucima',
  'coach.playerType.pressure.strength.1': 'Jaka mentalna priprema',
  'coach.playerType.pressure.strength.2': 'Pouzdanost pod pritiskom',
  'coach.playerType.pressure.risk.0': 'Može manje ulagati u rutinske situacije',
  'coach.playerType.pressure.risk.1': 'Može biti preintenzivan u situacijama bez pritiska',

  'coach.playerType.balanced.name': 'Uravnoteženi vratar',
  'coach.playerType.balanced.description':
    'Uravnoteženi si vratar. Nemaš velikih slabosti i pouzdano igraš u svim situacijama. Za sljedeću razinu razvij jednu istaknutu prednost.',
  'coach.playerType.balanced.focus':
    "Odaberi jednu vještinu koju ćeš posebno razvijati. Uz uravnoteženu igru izgradi i prepoznatljivu jaku stranu.",
  'coach.playerType.balanced.strength.0': 'Bez velikih slabosti',
  'coach.playerType.balanced.strength.1': 'Konstantan u svim situacijama',
  'coach.playerType.balanced.strength.2': 'Prilagodljiv različitim scenarijima utakmice',
  'coach.playerType.balanced.risk.0': 'Može nedostajati istaknuta prednost',
  'coach.playerType.balanced.risk.1': 'Može biti predvidiv iskusnim šuterima',

  'coach.playerType.developing.name': 'Vratar u razvoju',
  'coach.playerType.developing.description':
    'Vratar si u razvoju. Profil se još formira. Odradi više treninga i utakmica kako bi otključao specifičniji tip igrača i ciljanije treniranje.',
  'coach.playerType.developing.focus':
    'Fokusiraj se na osnove: strpljivost, čitanje šutera i mentalna priprema. Redovito odradi treninge i utakmice.',
  'coach.playerType.developing.strength.0': 'Gradiš temelje',
  'coach.playerType.developing.strength.1': 'Otvoren si za napredak',
  'coach.playerType.developing.strength.2': 'Svaki trening donosi podatke',
  'coach.playerType.developing.risk.0': "Neujednačena igra",
  'coach.playerType.developing.risk.1': 'Ograničeno iskustvo u nekim situacijama',

  'coach.skill.decisionMaking': 'Donošenje odluka',
  'coach.skill.patience': 'Strpljivost',
  'coach.skill.readingShooter': 'Čitanje šutera',
  'coach.skill.fastBreak': 'Kontranapad',
  'coach.skill.wingSituations': 'Situacije s krila',
  'coach.skill.sevenMetre': 'Sedmerci',
  'coach.skill.pressureHandling': 'Igra pod pritiskom',
  'coach.skill.consistency': "Ujednačenost",
  'coach.skill.mentalPreparation': 'Mentalna priprema',

  'cdCalendar.teamTraining.title': 'Timski trening',
  'cdCalendar.teamTraining.desc': "Taktičke vježbe i rad na organiziranoj igri",
  'cdCalendar.leagueMatch.title': 'Ligaška utakmica',
  'cdCalendar.leagueMatch.desc': "protiv {opponent}, domaća utakmica",
  'cdCalendar.recovery.title': 'Oporavak',
  'cdCalendar.recovery.desc': 'Lagani oporavak i video analiza',
  'cdCalendar.assignedSession.title': "{sessionType}: {playerName}",
  'cdCalendar.assignedSessionDesc': 'Dodijelio {coachName}',
  'cdCalendar.assignedNote.default': "Dovrši ovaj trening prije roka.",

  'cdRecommend.issue.wingSituations': 'Igrač prerano reagira u situacijama s krila.',
  'cdRecommend.action.wingSituations': 'Dodijeli trening s krila 03.',
  'cdRecommend.issue.pressure': 'Igrač se muči pod pritiskom.',
  'cdRecommend.action.pressure': 'Završi trening pod pritiskom.',
  'cdRecommend.issue.fastBreak': 'Odluke u kontranapadu su neujednačene.',
  'cdRecommend.action.fastBreak': 'Dodijeli trening kontranapada.',
  'cdRecommend.issue.sevenMetre': 'Učinak na sedmercima treba poboljšati.',
  'cdRecommend.action.sevenMetre': 'Dodijeli trening sedmeraca.',
  'cdRecommend.issue.mentalPreparation': 'Mentalna rutina priprema je neujednačena.',
  'cdRecommend.action.mentalPreparation': 'Završi mentalni trening.',
  'cdRecommend.issue.readingAbility':
    "Čitanje šutera treba rad: igrač reagira na rane signale.",
  'cdRecommend.action.readingAbility':
    'Dodijeli pripremu za utakmicu za vizualizaciju.',
  'cdRecommend.issue.none': 'Nema kritičnih slabosti.',
  'cdRecommend.action.none':
    'Nastavi redoviti trening. Dodijeli pripremu za utakmicu kako bi održao spremnost.',

  'category.general': 'Općenito',
  'category.wingShots': 'Šutevi s krila',
  'category.7mThrows': 'Sedmerci',
  'category.reading60Defence': 'Čitanje obrane 6:0',
  'category.finishingSixMetres': 'Završetci iz blizine',
  'category.fastBreakTiming': 'Tempiranje kontranapada',
  'category.fastBreak': 'Kontranapad',
  'category.powerPlay': 'Igrač više',
  'category.shortHanded': 'Igrač manje',
  'category.matchEnding': 'Završetak utakmice',
  'category.decisionMaking': 'Donošenje odluka',
  'category.pivot': 'Pivot',
  'category.pressure': 'Pritisci',
  'category.mental': "Mentalna priprema",

  'defensiveSystem.60': '6-0',
  'defensiveSystem.51': '5-1',
  'defensiveSystem.42': '4-2',
  'defensiveSystem.321': '3-2-1',
  'defensiveSystem.manToMan': 'Individualno čuvanje',
  'defensiveSystem.mixed': 'Mješovito',

  'cdCalendar.custom.title': '{text}',
  'cdCalendar.custom.description': '{text}',
};

export const coachEngineMessagesDe: Record<string, string> = {
  'coach.feedback.noData':
    'Noch nicht genug Daten. Absolviere mehr Einheiten und Spiele, um personalisiertes Feedback für {skill} freizuschalten.',
  'coach.feedback.trendUp': 'Trend nach oben um {n} Punkte — mach weiter so.',
  'coach.feedback.trendDown':
    'Der Trend ist zuletzt um {n} Punkte gesunken. Kehre zu den Grundlagen dieser Fähigkeit zurück.',

  'coach.feedback.decisionMaking.excellent':
    'Deine Entscheidungsfindung ist exzellent. Du bleibst geduldig und liest die Situation, bevor du dich festlegst.',
  'coach.feedback.decisionMaking.good':
    'Deine Entscheidungsfindung verbessert sich. Meist bleibst du geduldig, unter Druck bewegst du dich aber gelegentlich zu früh.',
  'coach.feedback.decisionMaking.developing':
    'Deine Entscheidungsfindung entwickelt sich. Manchmal legst du dich fest, bevor du die ganze Situation gelesen hast. Warte auf die finale Bewegung des Werfers.',
  'coach.feedback.decisionMaking.needsWork':
    'Deine Entscheidungsfindung braucht Aufmerksamkeit. Du neigst zu früher Festlegung. Verzögere deine erste Bewegung, bis du das Abwurfsignal siehst.',

  'coach.feedback.patience.excellent':
    'Geduld ist eine klare Stärke. Du hältst die Position und lässt den Werfer seine Absicht zeigen, bevor du reagierst.',
  'coach.feedback.patience.good':
    'Du zeigst in den meisten Situationen gute Geduld. Unter starkem Druck verkürzt du manchmal das Warten — vertraue deiner Position und halte einen Moment länger.',
  'coach.feedback.patience.developing':
    'Deine Geduld ist uneinheitlich. Manchmal bewegst du dich, bevor du den Werfer gelesen hast. Halte die Grundstellung, bis der Armschwung beginnt.',
  'coach.feedback.patience.needsWork':
    'Geduld ist deine größte Chance. Du legst dich oft fest, bevor der Werfer seinen Plan zeigt. Verlangsame und warte auf das Abwurfsignal.',

  'coach.feedback.readingShooter.excellent':
    'Du erkennst die Körperposition konstant gut. Verzögere weiter deine erste Bewegung und vertraue dem, was du siehst.',
  'coach.feedback.readingShooter.good':
    'Du liest den Werfer in den meisten Situationen gut. Gelegentlich reagierst du auf eine Finte — bestätige die Armposition, bevor du dich voll festlegst.',
  'coach.feedback.readingShooter.developing':
    'Dein Werfer-Lesen entwickelt sich. Manchmal reagierst du auf frühe Körpersignale statt auf die finale Armposition. Fokussiere den Abwurfpunkt.',
  'coach.feedback.readingShooter.needsWork':
    'Werfer lesen braucht Arbeit. Du reagierst oft auf die erste Bewegung statt auf den finalen Abwurf. Verfolge Handgelenk und Ellbogen im Abwurfmoment.',

  'coach.feedback.fastBreak.excellent':
    'Deine Tempogegenstoß-Entscheidungen sind scharf. Du kontrollierst dein Herauskommen und liest die Geschwindigkeit des Angreifers richtig.',
  'coach.feedback.fastBreak.good':
    'Du meisterst Tempogegenstöße gut. Gelegentlich kommst du zu weit heraus — stoppe bei fünf Metern und setze deine Position.',
  'coach.feedback.fastBreak.developing':
    'Im Tempogegenstoß bist du uneinheitlich. Manchmal kommst du zu früh heraus oder bleibst zu tief. Übe kontrolliertes Herauskommen bis zur Fünf-Meter-Linie.',
  'coach.feedback.fastBreak.needsWork':
    'Tempogegenstöße sind eine Schwäche. Du neigst entweder zu frühem Herauskommen oder zum Einfrieren. Arbeite an kontrolliertem, gleichmäßigem Herauskommen, das den Winkel verkürzt ohne Übercommitment.',

  'coach.feedback.wingSituations.excellent':
    'Dein Umgang mit Außenwürfen ist exzellent. Du hältst die Form und lässt den schwierigen Winkel für dich arbeiten.',
  'coach.feedback.wingSituations.good':
    'Du meisterst Außenwurfsituationen gut. Manchmal legst du dich früh auf den Nahbereich fest — halte die Position bis zum Abwurf.',
  'coach.feedback.wingSituations.developing':
    'Außenwurfsituationen sind uneinheitlich. Manchmal tippst du auf eine Ecke. Vertraue dem Winkel und reagiere auf den tatsächlichen Wurf.',
  'coach.feedback.wingSituations.needsWork':
    'Außenwürfe sind eine Schwäche. Du legst dich oft vor dem Abwurf fest. Der Winkel ist ohnehin schwierig — halte die Form und mach dich groß.',

  'coach.feedback.sevenMetre.excellent':
    'Deine 7-Meter-Leistung ist exzellent. Du bleibst zentral und reagierst auf den Wurf statt zu raten.',
  'coach.feedback.sevenMetre.good':
    'Du meisterst 7-Meter gut. Gelegentlich springst du nach Mustern vor — nutze sie als Kontext, nicht als Sicherheit.',
  'coach.feedback.sevenMetre.developing':
    'Deine 7-Meter-Leistung ist gemischt. Manchmal tippst du auf eine Seite. Bleib zentral und lies die Wurfbewegung.',
  'coach.feedback.sevenMetre.needsWork':
    '7-Meter-Würfe sind eine Schwäche. Du springst häufig vor. Ohne Information ist Reaktion dein bestes Werkzeug — bleib zentral und reagiere.',

  'coach.feedback.pressureHandling.excellent':
    'Du spielst gut unter Druck. Du hältst deine Routine und Atmung in kritischen Situationen.',
  'coach.feedback.pressureHandling.good':
    'Du spielst gut bis in die Schlussphase. Verlangsame deine Atmung vor kritischen Situationen und kehre zu deiner Pre-Shot-Routine zurück.',
  'coach.feedback.pressureHandling.developing':
    'Druck beeinflusst deine Entscheidungen. Unter Druck wirst du schneller. Übe deine Atemroutine und behandle jeden Wurf wie Wurf eins.',
  'coach.feedback.pressureHandling.needsWork':
    'Druckverhalten braucht deutliche Arbeit. In kritischen Momenten verlierst du deine Struktur. Baue eine Reset-Routine: ein Atemzug, ein Signalwort, eine Parade.',

  'coach.feedback.consistency.excellent':
    'Deine Konstanz ist exzellent. Du lieferst zuverlässige Leistungen über Einheiten und Spiele hinweg.',
  'coach.feedback.consistency.good':
    'Du bist meist konstant. Gelegentliche Einbrüche passieren — fokussiere dich auf deine Pre-Shot-Routine, um deinen Standard in jeder Situation zu halten.',
  'coach.feedback.consistency.developing':
    'Deine Konstanz schwankt. Manche Einheiten sind stark, andere fallen ab. Baue eine wiederholbare Pre-Shot-Routine für ein stabileres Niveau.',
  'coach.feedback.consistency.needsWork':
    'Konstanz ist eine deutliche Lücke. Deine Leistung schwankt stark. Fokussiere dich auf ein wiederholbares Signal vor jeder Aktion.',

  'coach.feedback.mentalPreparation.excellent':
    'Deine mentale Vorbereitung ist exzellent. Du kommst fokussiert und setzt dich nach Rückschlägen gut zurück.',
  'coach.feedback.mentalPreparation.good':
    'Deine mentale Vorbereitung ist solide. Du profitierst von Atmung und Visualisierung vor dem Spiel — bleib konsequent dabei.',
  'coach.feedback.mentalPreparation.developing':
    'Mentale Vorbereitung entwickelt sich. Manchmal überspringst du deine Routine. Bereite dich vor dem Spiel konsequenter vor.',
  'coach.feedback.mentalPreparation.needsWork':
    'Mentale Vorbereitung braucht Aufmerksamkeit. Du schließt selten Routinen vor dem Spiel ab. Starte mit einer kurzen Atemübung vor jedem Spiel.',

  'coach.weekly.improvementUp':
    '{skill} hat sich um {n} Punkte gegenüber deinen vorherigen Einheiten verbessert.',
  'coach.weekly.improvementStable':
    'Deine Fähigkeiten halten sich stabil. Keine großen Sprünge diese Woche, aber Konstanz ist wertvoll.',
  'coach.weekly.weaknessLow':
    '{skill} ist dein schwächster Bereich mit {score}%. Hier sind die größten Fortschritte möglich.',
  'coach.weekly.weaknessModerate':
    '{skill} ist dein schwächster Bereich mit {score}%, was noch ein solides Niveau ist. Kleine Verbesserungen hier runden dein Spiel ab.',
  'coach.weekly.recFocusWeak':
    'Fokussiere dich nächste Woche auf {skill}. Füge zwei kurze Einheiten für diesen Bereich hinzu und absolviere eine Spieltagsvorbereitung vor dem nächsten Spiel.',
  'coach.weekly.recTrendUp':
    'Dein Trend geht nach oben. Behalte deine Routine bei und füge eine Extra-Einheit für {skill} hinzu, um deinen Gesamtscore zu steigern.',
  'coach.weekly.recTrendDown':
    'Dein jüngster Trend ist leicht gesunken. Kehre zu den Grundlagen zurück — absolviere eine Spieltagsvorbereitung und fokussiere dich auf Atmung vor dem nächsten Spiel.',
  'coach.weekly.recStable':
    'Deine Leistung ist stabil. Für den Durchbruch ziele auf {skill} mit zwei fokussierten Einheiten und absolviere eine Nachspielreflexion nach dem nächsten Spiel.',
  'coach.weekly.allSkillsStable': 'Alle Fähigkeiten sind stabil',

  'coach.plan.focus.decisionMaking': 'Entscheidungsfindung',
  'coach.plan.desc.decisionMaking':
    'Szenariokarten durchgehen und die volle Situation lesen, bevor du dich festlegst.',
  'coach.plan.focus.patience': 'Geduldstraining',
  'coach.plan.desc.patience':
    'Grundstellung halten üben. Auf die finale Bewegung des Werfers warten, bevor du reagierst.',
  'coach.plan.focus.readingShooter': 'Werfer lesen',
  'coach.plan.desc.readingShooter':
    'Körperposition, Schulterwinkel und Armschwung-Signale studieren. Erste Bewegung verzögern.',
  'coach.plan.focus.fastBreak': 'Tempogegenstoß-Entscheidungen',
  'coach.plan.desc.fastBreak':
    'Kontrolliertes Herauskommen bis zur Fünf-Meter-Linie und Geschwindigkeit des Angreifers lesen.',
  'coach.plan.focus.wingSituations': 'Außenwurfsituationen',
  'coach.plan.desc.wingSituations':
    'Positionierung bei Außenwürfen trainieren. Form halten und den Winkel für dich arbeiten lassen.',
  'coach.plan.focus.sevenMetre': '7-Meter-Würfe',
  'coach.plan.desc.sevenMetre':
    'Zentral auf 7-Meter-Würfen bleiben. Auf die Wurfbewegung reagieren, nicht raten.',
  'coach.plan.focus.pressureHandling': 'Drucksituationen',
  'coach.plan.desc.pressureHandling':
    'Spätspiel-Druck simulieren. Atemroutine vor jeder kritischen Parade üben.',
  'coach.plan.focus.consistency': 'Konstanztraining',
  'coach.plan.desc.consistency':
    'Pre-Shot-Routine vor jeder Aktion wiederholen. Ein zuverlässiges Signalwort aufbauen.',
  'coach.plan.focus.mentalPreparation': 'Mentale Vorbereitung',
  'coach.plan.desc.mentalPreparation':
    'Spieltagsvorbereitung abschließen. Atmung, Visualisierung und taktische Review.',
  'coach.plan.desc.pressureFriday':
    'Hochdruckszenarien simulieren. Atmung und Reset-Routine vor kritischen Paraden üben.',
  'coach.plan.focus.matchPrep': 'Spielvorbereitung',
  'coach.plan.desc.matchPrep':
    'Volle Spieltagsvorbereitung abschließen. Atmung, mentaler Reset, Visualisierung und taktische Szenarien.',
  'coach.plan.focus.recovery': 'Regeneration und Review',
  'coach.plan.desc.recovery':
    'Leichte Wochenreview. Reflektiere, was sich verbessert hat, und setze einen Fokus für nächste Woche.',

  'coach.playerType.calmReader.name': 'Gelassener Leser',
  'coach.playerType.calmReader.description':
    'Du bist ein gelassener Leser. Du bleibst geduldig, liest den Werfer gut und legst dich selten früh fest. Deine Gelassenheit ist eine Stärke — nutze sie und verbessere gleichzeitig deine Tempo im Tempogegenstoß.',
  'coach.playerType.calmReader.focus':
    'Reaktionsgeschwindigkeit im Tempogegenstoß verbessern und dabei deinen geduldigen Lesestil beibehalten.',
  'coach.playerType.calmReader.strength.0': 'Geduld vor der Festlegung',
  'coach.playerType.calmReader.strength.1': 'Lesen der Körperposition des Werfers',
  'coach.playerType.calmReader.strength.2': 'Gelassenheit unter Druck',
  'coach.playerType.calmReader.risk.0': 'Kann durch zu viel Passivität bei schnellen Angriffen Gegentore kassieren',
  'coach.playerType.calmReader.risk.1': 'Tempogegenstoß-Entscheidungen können langsam sein',

  'coach.playerType.aggressive.name': 'Aggressiver Torwart',
  'coach.playerType.aggressive.description':
    'Du bist ein aggressiver Torwart. Du kommst selbstbewusst heraus und blühst unter Druck auf. Dein Risiko ist Übercommitment — füge Geduld in dein Positionspiel ein.',
  'coach.playerType.aggressive.focus':
    'Aggression mit mehr Geduld ausbalancieren. Auf das Abwurfsignal bei Angriffen aus dem Spiel warten.',
  'coach.playerType.aggressive.strength.0': 'Tempogegenstoß-Entscheidungen',
  'coach.playerType.aggressive.strength.1': 'Selbstvertrauen unter Druck',
  'coach.playerType.aggressive.strength.2': 'Proaktive Positionierung',
  'coach.playerType.aggressive.risk.0': 'Legt sich manchmal zu früh fest',
  'coach.playerType.aggressive.risk.1': 'Kann von geduldigen Werfern ausgespielt werden',

  'coach.playerType.reactive.name': 'Reaktiver Torwart',
  'coach.playerType.reactive.description':
    'Du bist ein reaktiver Torwart. Du verlässt dich auf Reaktion und Konstanz statt auf frühes Lesen. Stärke dein Werfer-Lesen für das nächste Level.',
  'coach.playerType.reactive.focus':
    'Werfer-Lesen verbessern. Fokus auf Schulter- und Handgelenk-Signale beim Abwurf.',
  'coach.playerType.reactive.strength.0': 'Konstante Leistungen',
  'coach.playerType.reactive.strength.1': 'Zuverlässige Entscheidungsfindung',
  'coach.playerType.reactive.strength.2': 'Starke Reaktionsparaden',
  'coach.playerType.reactive.risk.0': 'Kann gegen Werfer mit starken Finten kämpfen',
  'coach.playerType.reactive.risk.1': 'Lesen von Körpersignalen braucht Verbesserung',

  'coach.playerType.pressure.name': 'Druckspezialist',
  'coach.playerType.pressure.description':
    'Du bist ein Druckspezialist. Du glänzt in kritischen Momenten und bereitest dich mental besser vor als die meisten. Balanciere das mit Konstanz in Alltagssituationen.',
  'coach.playerType.pressure.focus':
    'Druckleistung halten und Konstanz in Routine-Situationen verbessern.',
  'coach.playerType.pressure.strength.0': 'Leistung in kritischen Momenten',
  'coach.playerType.pressure.strength.1': 'Starke mentale Vorbereitung',
  'coach.playerType.pressure.strength.2': 'Zuverlässigkeit unter Druck',
  'coach.playerType.pressure.risk.0': 'Investiert in Routine-Situationen vielleicht zu wenig',
  'coach.playerType.pressure.risk.1': 'Kann in Low-Pressure-Momenten zu intensiv sein',

  'coach.playerType.balanced.name': 'Ausgewogener Torwart',
  'coach.playerType.balanced.description':
    'Du bist ein ausgewogener Torwart. Du hast keine großen Schwächen und spielst in allen Situationen zuverlässig. Für das nächste Level entwickle eine herausragende Stärke.',
  'coach.playerType.balanced.focus':
    'Wähle eine Fähigkeit für Exzellenz. Verwandle ein ausgewogenes Spiel in ein dominantes.',
  'coach.playerType.balanced.strength.0': 'Keine großen Schwächen',
  'coach.playerType.balanced.strength.1': 'Konstant in allen Situationen',
  'coach.playerType.balanced.strength.2': 'Anpassungsfähig an verschiedene Spielszenarien',
  'coach.playerType.balanced.risk.0': 'Fehlt vielleicht eine herausragende Stärke',
  'coach.playerType.balanced.risk.1': 'Kann für erfahrene Werfer vorhersehbar sein',

  'coach.playerType.developing.name': 'Torwart in Entwicklung',
  'coach.playerType.developing.description':
    'Du bist ein Torwart in Entwicklung. Dein Profil formt sich noch. Absolviere mehr Einheiten und Spiele, um einen spezifischeren Spielertyp und gezielteres Coaching freizuschalten.',
  'coach.playerType.developing.focus':
    'Fokussiere dich auf die Grundlagen: Geduld, Werfer lesen und mentale Vorbereitung. Trainiere und spiele regelmäßig.',
  'coach.playerType.developing.strength.0': 'Grundlagen werden aufgebaut',
  'coach.playerType.developing.strength.1': 'Offen für Verbesserung',
  'coach.playerType.developing.strength.2': 'Jede Einheit liefert Daten',
  'coach.playerType.developing.risk.0': 'Uneinheitliche Leistungen',
  'coach.playerType.developing.risk.1': 'Begrenzte Erfahrung in manchen Situationen',

  'coach.skill.decisionMaking': 'Entscheidungsfindung',
  'coach.skill.patience': 'Geduld',
  'coach.skill.readingShooter': 'Werfer lesen',
  'coach.skill.fastBreak': 'Tempogegenstoß',
  'coach.skill.wingSituations': 'Außenwurfsituationen',
  'coach.skill.sevenMetre': '7-Meter-Situationen',
  'coach.skill.pressureHandling': 'Druckverhalten',
  'coach.skill.consistency': 'Konstanz',
  'coach.skill.mentalPreparation': 'Mentale Vorbereitung',

  'cdCalendar.teamTraining.title': 'Teamtraining',
  'cdCalendar.teamTraining.desc': 'Taktische Übungen und Standardsituationen',
  'cdCalendar.leagueMatch.title': 'Ligaspiel',
  'cdCalendar.leagueMatch.desc': 'gegen {opponent} — Heimspiel',
  'cdCalendar.recovery.title': 'Regeneration',
  'cdCalendar.recovery.desc': 'Leichte Regeneration und Videoanalyse',
  'cdCalendar.assignedSession.title': '{sessionType} — {playerName}',
  'cdCalendar.assignedSessionDesc': 'Zugewiesen von {coachName}',
  'cdCalendar.assignedNote.default': 'Schließe diese Einheit vor dem Fälligkeitsdatum ab.',

  'cdRecommend.issue.wingSituations': 'Spieler reagiert in Außenwurfsituationen zu früh.',
  'cdRecommend.action.wingSituations': 'Außenwurf-Einheit 03 zuweisen.',
  'cdRecommend.issue.pressure': 'Spieler kämpft unter Druck.',
  'cdRecommend.action.pressure': 'Drucktraining abschließen.',
  'cdRecommend.issue.fastBreak': 'Tempogegenstoß-Entscheidungen sind uneinheitlich.',
  'cdRecommend.action.fastBreak': 'Tempogegenstoß-Einheit zuweisen.',
  'cdRecommend.issue.sevenMetre': '7-Meter-Leistung muss verbessert werden.',
  'cdRecommend.action.sevenMetre': '7-Meter-Einheit zuweisen.',
  'cdRecommend.issue.mentalPreparation': 'Mentale Vorbereitungsroutine ist uneinheitlich.',
  'cdRecommend.action.mentalPreparation': 'Mentaltraining abschließen.',
  'cdRecommend.issue.readingAbility':
    'Werfer lesen braucht Arbeit — Spieler reagiert auf frühe Signale.',
  'cdRecommend.action.readingAbility':
    'Spieltagsvorbereitung für Visualisierung zuweisen.',
  'cdRecommend.issue.none': 'Keine kritischen Schwächen erkannt.',
  'cdRecommend.action.none':
    'Regelmäßiges Training fortsetzen. Spieltagsvorbereitung zuweisen, um die Einsatzbereitschaft zu halten.',

  'category.general': 'Allgemein',
  'category.wingShots': 'Außenwürfe',
  'category.7mThrows': '7-Meter-Würfe',
  'category.reading60Defence': '6:0-Abwehr lesen',
  'category.finishingSixMetres': 'Abschlüsse aus dem Halbkreis',
  'category.fastBreakTiming': 'Tempogegenstoß-Timing',
  'category.fastBreak': 'Tempogegenstoß',
  'category.powerPlay': 'Überzahl',
  'category.shortHanded': 'Unterzahl',
  'category.matchEnding': 'Spielende',
  'category.decisionMaking': 'Entscheidungsfindung',
  'category.pivot': 'Kreisläufer',
  'category.pressure': 'Drucksituationen',
  'category.mental': 'Mental',

  'defensiveSystem.60': '6-0',
  'defensiveSystem.51': '5-1',
  'defensiveSystem.42': '4-2',
  'defensiveSystem.321': '3-2-1',
  'defensiveSystem.manToMan': 'Mann gegen Mann',
  'defensiveSystem.mixed': 'Gemischt',

  'cdCalendar.custom.title': '{text}',
  'cdCalendar.custom.description': '{text}',
};
