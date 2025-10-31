/* =========================
   GLOBAL STATE
========================= */
let currentWeekOffset = 0;
let currentDayIndex = null;

let currentLanguage = 'en';
let currentTheme = 'light';
// 0=Sunday .. 6=Saturday; default Monday (1)
let weekStart = 1;

let workouts = {};            // {weekKey: {dayIndex: [ {...}, ...]}}
let measurementData = [];     // [{ date:'YYYY-MM-DD', weight:80, height:180 }]

let chartInitialized = false;

// DnD
let draggedWorkout = null;

// editing workout
let editingWorkout = null;
let editingDayIndex = null;
let editingWorkoutIndex = null;

// units
const KG_TO_LB = 2.2046226218;
const CM_PER_INCH = 2.54;
const INCHES_PER_FOOT = 12;
let currentWeightUnit = 'kg';
let currentHeightUnit = 'cm';
const MEASUREMENT_KEEP_DAYS = 90;
let currentChartMetric = 'weight';
let currentActivityLevel = 1.2;

/* =========================
   TRANSLATIONS
========================= */
const translations = {
    tr: {
        'workout-plan': 'Antrenman Plan',
        'body-tracking': 'Vücut Takip',
        'measurements': 'Ölçümler',
        'bmi': 'Vücut Kitle Endeksi',
        'bmi-underweight': 'ZAYIF',
        'bmi-normal': 'NORMAL',
        'bmi-overweight': 'FAZLA KİLOLU',
        'bmi-obese': 'OBEZ',
        'bmi-severely-obese': 'AŞIRI OBEZ',
        'monday': 'Pazartesi',
        'tuesday': 'Salı',
        'wednesday': 'Çarşamba',
        'thursday': 'Perşembe',
        'friday': 'Cuma',
        'saturday': 'Cumartesi',
        'sunday': 'Pazar',
        'add-workout': 'Egzersiz Ekle',
        'edit-workout': 'Egzersizi Düzenle',
        'workout-name': 'Egzersiz Adı',
        'select-or-create': 'Seç veya Yeni Oluştur',
        'add-new': '+ Yeni Ekle',
        'workout-icon': 'Egzersiz İkonu',
        'body-part': 'Vücut Bölgesi',
        'workout-type': 'Egzersiz Tipi',
        'time-based': 'Zaman Bazlı',
        'rep-based': 'Tekrar Bazlı',
        'duration': 'Süre (dakika)',
        'sets': 'Set',
        'reps': 'Tekrar',
        'rest-time': 'Dinlenme Süresi (saniye)',
        'location': 'Nerede?',
        'cancel': 'İptal',
        'save': 'Kaydet',
        'weight-chart': 'Kilo Grafiği',
        'copy-day': 'Günü Kopyala',
        'paste-day': 'Güne Yapıştır',
        'edit': 'Düzenle',
        'delete': 'Sil',
        'workout-saved': 'Egzersiz başarıyla kaydedildi!',
        'workout-updated': 'Egzersiz başarıyla güncellendi!',
        'workout-deleted': 'Egzersiz başarıyla silindi!',
        'measurement-saved': 'Ölçümler başarıyla kaydedildi!',
        'day-copied': 'Gün başarıyla kopyalandı!',
        'day-pasted': 'Gün başarıyla yapıştırıldı!',
        'weight-label': 'Kilo',
        'height-label': 'Boy',
        'unit-kg': 'KG',
        'unit-lb': 'LB',
        'unit-cm': 'CM',
        'unit-ftin': 'FT/IN',
        'unit-kg-short': 'kg',
        'unit-lb-short': 'lb',
        'unit-cm-short': 'cm',
        'unit-ft-short': 'ft',
        'unit-in-short': 'in',
        'feet-label': 'Ayak',
        'inches-label': 'İnç',
        'settings': 'Ayarlar',
        'theme': 'Tema',
        'switch-to-light': 'Aydınlık moda geç',
        'switch-to-dark': 'Karanlık moda geç',
        'language': 'Dil',
        'delete-data': 'Verileri Sil',
        'week-start': 'Haftanın Başlangıcı',
        'week-start-label': 'Hafta şu gün başlar: {day}',
        'gender': 'Cinsiyet',
        'male': 'Erkek',
        'female': 'Kadın',
        'age': 'Yaş',
        'body-fat': 'Tahmini Yağ Oranı',
        'confirm-delete-message': 'Verileri silmek istediğinize emin misiniz?',
        'confirm': 'Evet',
        'data-cleared': 'Tüm veriler silindi!',
        'new-workout-name': 'Yeni egzersiz adı',
        'new-body-part': 'Yeni vücut bölgesi',
        'new-location': 'Yeni konum',
        'copy-week-forward': 'Gelecek haftaya kopyala',
        'week-copied': 'Antrenmanlar gelecek haftaya kopyalandı!',
        'last-measurement': 'Son ölçüm: {weight}, {height} ({date})',
        'no-data': 'Veri yok',
        'no-data-period': 'Bu dönem için veri yok',
        'fill-required': 'Lütfen tüm zorunlu alanları doldurun!',
        'future-date-error': 'Gelecek tarih için ölçüm girişi yapamazsınız!',
        'no-copied-day': 'Kopyalanmış gün verisi bulunamadı!',
        'paste-error': 'Veri yapıştırılırken bir hata oluştu!',
    },
    en: {
        'workout-plan': 'Workout Plan',
        'body-tracking': 'Body Tracking',
        'measurements': 'Measurements',
        'bmi': 'Body Mass Index',
        'bmi-underweight': 'UNDERWEIGHT',
        'bmi-normal': 'NORMAL',
        'bmi-overweight': 'OVERWEIGHT',
        'bmi-obese': 'OBESE',
        'bmi-severely-obese': 'SEVERELY OBESE',
        'monday': 'Monday',
        'tuesday': 'Tuesday',
        'wednesday': 'Wednesday',
        'thursday': 'Thursday',
        'friday': 'Friday',
        'saturday': 'Saturday',
        'sunday': 'Sunday',
        'add-workout': 'Add Workout',
        'edit-workout': 'Edit Workout',
        'workout-name': 'Workout Name',
        'select-or-create': 'Select or Create New',
        'add-new': '+ Add New',
        'workout-icon': 'Workout Icon',
        'body-part': 'Body Part',
        'workout-type': 'Workout Type',
        'time-based': 'Time Based',
        'rep-based': 'Rep Based',
        'duration': 'Duration (minutes)',
        'sets': 'Sets',
        'reps': 'Reps',
        'rest-time': 'Rest Time (seconds)',
        'location': 'Where?',
        'cancel': 'Cancel',
        'save': 'Save',
        'weight-chart': 'Weight Chart',
        'copy-day': 'Copy Day',
        'paste-day': 'Paste to Day',
        'edit': 'Edit',
        'delete': 'Delete',
        'workout-saved': 'Workout saved successfully!',
        'workout-updated': 'Workout updated successfully!',
        'workout-deleted': 'Workout deleted successfully!',
        'measurement-saved': 'Measurements saved successfully!',
        'day-copied': 'Day copied successfully!',
        'day-pasted': 'Day pasted successfully!',
        'weight-label': 'Weight',
        'height-label': 'Height',
        'unit-kg': 'KG',
        'unit-lb': 'LB',
        'unit-cm': 'CM',
        'unit-ftin': 'FT/IN',
        'unit-kg-short': 'kg',
        'unit-lb-short': 'lb',
        'unit-cm-short': 'cm',
        'unit-ft-short': 'ft',
        'unit-in-short': 'in',
        'feet-label': 'Feet',
        'inches-label': 'Inches',
        'settings': 'Settings',
        'theme': 'Theme',
        'switch-to-light': 'Switch to Light Mode',
        'switch-to-dark': 'Switch to Dark Mode',
        'language': 'Language',
        'delete-data': 'Delete Data',
        'week-start': 'Week Start',
        'week-start-label': 'Week starts on: {day}',
        'gender': 'Gender',
        'male': 'Male',
        'female': 'Female',
        'body-fat': 'Estimated Body Fat',
        'waist': 'Waist',
        'hip': 'Hip',
        'neck': 'Neck',
        'waist-help': 'Men: measure at the navel (widest). Women: at the narrowest waist, tape parallel to floor, normal breathing.',
        'hip-help': 'Stand upright. Measure around the widest part of the hips/glutes; tape parallel to the floor.',
        'neck-help': 'Measure at the narrowest point of the neck; for men just below Adam\'s apple; do not compress the tape.',
        'export-data': 'Export Data',
        'import-data': 'Import Data',
        'import-success': 'Data imported successfully',
        'import-failed': 'Import failed',
        'old-date-error': 'Only the last 90 days are allowed.',
        'confirm-delete-message': 'Are you sure you want to delete all data?',
        'confirm': 'Yes',
        'data-cleared': 'All data deleted!',
        'new-workout-name': 'New workout name',
        'new-body-part': 'New body part',
        'new-location': 'New location',
        'copy-week-forward': 'Copy To Next Week',
        'week-copied': 'Workouts copied to next week!',
        'last-measurement': 'Last measurement: {weight}, {height} ({date})',
        'no-data': 'No data',
        'no-data-period': 'No data for this period',
        'fill-required': 'Please fill all required fields!',
        'future-date-error': 'You cannot add a future measurement!',
        'no-copied-day': 'No copied day data found!',
        'paste-error': 'An error occurred while pasting!',
        'bmr': 'Basal Metabolic Rate',
        'activity-level': 'Activity Level',
        'daily-calories': 'Daily Calorie Need',
        'act-sedentary': 'Very little activity (desk)',
        'act-light': 'Lightly active (1–3 workouts/week)',
        'act-moderate': 'Moderately active (3–5)',
        'act-very': 'Very active (6+)',
        'act-super': 'Super active (2/day or heavy work)',
        'metric-weight': 'Weight',
        'metric-waist': 'Waist',
        'metric-hip': 'Hip',
        'metric-neck': 'Neck',
        'metric-bmi': 'BMI',
        'metric-bodyfat': 'Body Fat %',
    },
    fr: {
        'workout-plan': 'Plan d\'Entraînement',
        'body-tracking': 'Suivi Corporel',
        'measurements': 'Mesures',
        'bmi': 'Indice de Masse Corporelle',
        'bmi-underweight': 'INSUFFISANCE PONDÉRALE',
        'bmi-normal': 'NORMAL',
        'bmi-overweight': 'SURPOIDS',
        'bmi-obese': 'OBÉSITÉ',
        'bmi-severely-obese': 'OBÉSITÉ MORBIDE',
        'monday': 'Lundi',
        'tuesday': 'Mardi',
        'wednesday': 'Mercredi',
        'thursday': 'Jeudi',
        'friday': 'Vendredi',
        'saturday': 'Samedi',
        'sunday': 'Dimanche',
        'add-workout': 'Ajouter un Exercice',
        'edit-workout': 'Modifier l\'Exercice',
        'workout-name': 'Nom de l\'Exercice',
        'select-or-create': 'Sélectionner ou Créer',
        'add-new': '+ Ajouter Nouveau',
        'workout-icon': 'Icône d\'Exercice',
        'body-part': 'Partie du Corps',
        'workout-type': 'Type d\'Exercice',
        'time-based': 'Basé sur le Temps',
        'rep-based': 'Basé sur les Répétitions',
        'duration': 'Durée (minutes)',
        'sets': 'Séries',
        'reps': 'Répétitions',
        'rest-time': 'Temps de Repos (secondes)',
        'location': 'Où?',
        'cancel': 'Annuler',
        'save': 'Enregistrer',
        'weight-chart': 'Graphique de Poids',
        'copy-day': 'Copier le Jour',
        'paste-day': 'Coller au Jour',
        'edit': 'Modifier',
        'delete': 'Supprimer',
        'workout-saved': 'Exercice enregistré avec succès!',
        'workout-updated': 'Exercice mis à jour avec succès!',
        'workout-deleted': 'Exercice supprimé avec succès!',
        'measurement-saved': 'Mesures enregistrées avec succès!',
        'day-copied': 'Jour copié avec succès!',
        'day-pasted': 'Jour collé avec succès!',
        'weight-label': 'Poids',
        'height-label': 'Taille',
        'unit-kg': 'KG',
        'unit-lb': 'LB',
        'unit-cm': 'CM',
        'unit-ftin': 'PI/PO',
        'unit-kg-short': 'kg',
        'unit-lb-short': 'lb',
        'unit-cm-short': 'cm',
        'unit-ft-short': 'pi',
        'unit-in-short': 'po',
        'feet-label': 'Pieds',
        'inches-label': 'Pouces',
        'settings': 'Paramètres',
        'theme': 'Thème',
        'switch-to-light': 'Passer en mode clair',
        'switch-to-dark': 'Passer en mode sombre',
        'language': 'Langue',
        'week-start': 'Début de semaine',
        'week-start-label': 'La semaine commence le: {day}',
        'gender': 'Sexe',
        'male': 'Homme',
        'female': 'Femme',
        'age': 'Âge',
        'body-fat': 'Graisse corporelle estimée',
        'delete-data': 'Supprimer les données',
        'confirm-delete-message': 'Êtes-vous sûr de vouloir supprimer toutes les données ?',
        'confirm': 'Oui',
        'data-cleared': 'Toutes les données ont été supprimées !',
        'new-workout-name': "Nouveau nom d'exercice",
        'new-body-part': 'Nouvelle partie du corps',
        'new-location': 'Nouvel emplacement',
        'copy-week-forward': 'Copier vers la semaine prochaine',
        'week-copied': 'Entraînements copiés vers la semaine prochaine !',
        'last-measurement': 'Dernière mesure : {weight}, {height} ({date})',
        'no-data': 'Aucune donnée',
        'no-data-period': 'Aucune donnée pour cette période',
        'fill-required': 'Veuillez remplir tous les champs requis!',
        'future-date-error': 'Vous ne pouvez pas ajouter une mesure future!',
        'no-copied-day': 'Aucune journée copiée!',
        'paste-error': 'Erreur lors du collage!',
    },
    es: {
        'workout-plan': 'Plan de Entrenamiento',
        'body-tracking': 'Seguimiento Corporal',
        'measurements': 'Mediciones',
        'bmi': 'Índice de Masa Corporal',
        'bmi-underweight': 'BAJO PESO',
        'bmi-normal': 'NORMAL',
        'bmi-overweight': 'SOBREPESO',
        'bmi-obese': 'OBESIDAD',
        'bmi-severely-obese': 'OBESIDAD MÓRBIDA',
        'monday': 'Lunes',
        'tuesday': 'Martes',
        'wednesday': 'Miércoles',
        'thursday': 'Jueves',
        'friday': 'Viernes',
        'saturday': 'Sábado',
        'sunday': 'Domingo',
        'add-workout': 'Agregar Ejercicio',
        'edit-workout': 'Editar Ejercicio',
        'workout-name': 'Nombre del Ejercicio',
        'select-or-create': 'Seleccionar o Crear Nuevo',
        'add-new': '+ Agregar Nuevo',
        'workout-icon': 'Icono del Ejercicio',
        'body-part': 'Parte del Cuerpo',
        'workout-type': 'Tipo de Ejercicio',
        'time-based': 'Basado en Tiempo',
        'rep-based': 'Basado en Repeticiones',
        'duration': 'Duración (minutos)',
        'sets': 'Series',
        'reps': 'Repeticiones',
        'rest-time': 'Tiempo de Descanso (segundos)',
        'location': '¿Dónde?',
        'cancel': 'Cancelar',
        'save': 'Guardar',
        'weight-chart': 'Gráfico de Peso',
        'copy-day': 'Copiar Día',
        'paste-day': 'Pegar en Día',
        'edit': 'Editar',
        'delete': 'Eliminar',
        'workout-saved': '¡Ejercicio guardado exitosamente!',
        'workout-updated': '¡Ejercicio actualizado exitosamente!',
        'workout-deleted': '¡Ejercicio eliminado exitosamente!',
        'measurement-saved': '¡Mediciones guardadas exitosamente!',
        'day-copied': '¡Día copiado exitosamente!',
        'day-pasted': '¡Día pegado exitosamente!',
        'weight-label': 'Peso',
        'height-label': 'Altura',
        'unit-kg': 'KG',
        'unit-lb': 'LB',
        'unit-cm': 'CM',
        'unit-ftin': 'FT/IN',
        'unit-kg-short': 'kg',
        'unit-lb-short': 'lb',
        'unit-cm-short': 'cm',
        'unit-ft-short': 'ft',
        'unit-in-short': 'in',
        'feet-label': 'Pies',
        'inches-label': 'Pulgadas',
        'settings': 'Configuración',
        'theme': 'Tema',
        'switch-to-light': 'Cambiar a modo claro',
        'switch-to-dark': 'Cambiar a modo oscuro',
        'language': 'Idioma',
        'week-start': 'Início da semana',
        'week-start-label': 'A semana começa em: {day}',
        'gender': 'Gênero',
        'male': 'Masculino',
        'female': 'Feminino',
        'age': 'Idade',
        'body-fat': 'Gordura corporal estimada',
        'week-start': 'Inicio de semana',
        'week-start-label': 'La semana comienza el: {day}',
        'gender': 'Género',
        'male': 'Hombre',
        'female': 'Mujer',
        'age': 'Edad',
        'body-fat': 'Grasa corporal estimada',
        'delete-data': 'Eliminar datos',
        'confirm-delete-message': '¿Seguro que deseas eliminar todos los datos?',
        'confirm': 'Sí',
        'data-cleared': '¡Todos los datos se han eliminado!',
        'new-workout-name': 'Nuevo nombre de ejercicio',
        'new-body-part': 'Nueva parte del cuerpo',
        'new-location': 'Nueva ubicación',
        'copy-week-forward': 'Copiar a la próxima semana',
        'week-copied': '¡Entrenamientos copiados a la próxima semana!',
        'last-measurement': 'Última medición: {weight}, {height} ({date})',
        'no-data': 'Sin datos',
        'no-data-period': 'Sin datos para este período',
        'fill-required': '¡Complete todos los campos requeridos!',
        'future-date-error': '¡No puedes agregar una medición futura!',
        'no-copied-day': '¡No se encontró día copiado!',
        'paste-error': '¡Error al pegar!',
    },
    de: {
        'workout-plan': 'Trainingsplan',
        'body-tracking': 'Körperverfolgung',
        'measurements': 'Messungen',
        'bmi': 'Body-Mass-Index',
        'bmi-underweight': 'UNTERGEWICHT',
        'bmi-normal': 'NORMAL',
        'bmi-overweight': 'ÜBERGEWICHT',
        'bmi-obese': 'ADIPOSITAS',
        'bmi-severely-obese': 'STARK ADIPÖS',
        'monday': 'Montag',
        'tuesday': 'Dienstag',
        'wednesday': 'Mittwoch',
        'thursday': 'Donnerstag',
        'friday': 'Freitag',
        'saturday': 'Samstag',
        'sunday': 'Sonntag',
        'add-workout': 'Übung Hinzufügen',
        'edit-workout': 'Übung Bearbeiten',
        'workout-name': 'Übungsname',
        'select-or-create': 'Auswählen oder Neu Erstellen',
        'add-new': '+ Neu Hinzufügen',
        'workout-icon': 'Übungs-Icon',
        'body-part': 'Körperteil',
        'workout-type': 'Übungstyp',
        'time-based': 'Zeitbasiert',
        'rep-based': 'Wiederholungsbasiert',
        'duration': 'Dauer (Minuten)',
        'sets': 'Sätze',
        'reps': 'Wiederholungen',
        'rest-time': 'Ruhezeit (Sekunden)',
        'location': 'Wo?',
        'cancel': 'Abbrechen',
        'save': 'Speichern',
        'weight-chart': 'Gewichtsdiagramm',
        'copy-day': 'Tag Kopieren',
        'paste-day': 'In Tag Einfügen',
        'edit': 'Bearbeiten',
        'delete': 'Löschen',
        'workout-saved': 'Übung erfolgreich gespeichert!',
        'workout-updated': 'Übung erfolgreich aktualisiert!',
        'workout-deleted': 'Übung erfolgreich gelöscht!',
        'measurement-saved': 'Messungen erfolgreich gespeichert!',
        'day-copied': 'Tag erfolgreich kopiert!',
        'day-pasted': 'Tag erfolgreich eingefügt!',
        'weight-label': 'Gewicht',
        'height-label': 'Größe',
        'unit-kg': 'KG',
        'unit-lb': 'LB',
        'unit-cm': 'CM',
        'unit-ftin': 'FT/IN',
        'unit-kg-short': 'kg',
        'unit-lb-short': 'lb',
        'unit-cm-short': 'cm',
        'unit-ft-short': 'ft',
        'unit-in-short': 'in',
        'feet-label': 'Füße',
        'inches-label': 'Zoll',
        'settings': 'Einstellungen',
        'theme': 'Thema',
        'switch-to-light': 'Zum hellen Modus wechseln',
        'switch-to-dark': 'Zum dunklen Modus wechseln',
        'language': 'Sprache',
        'week-start': 'Wochenbeginn',
        'week-start-label': 'Woche beginnt am: {day}',
        'gender': 'Geschlecht',
        'male': 'Männlich',
        'female': 'Weiblich',
        'age': 'Alter',
        'body-fat': 'Geschätzter Körperfettanteil',
        'delete-data': 'Daten löschen',
        'confirm-delete-message': 'Möchten Sie wirklich alle Daten löschen?',
        'confirm': 'Ja',
        'data-cleared': 'Alle Daten wurden gelöscht!',
        'new-workout-name': 'Neuer Trainingsname',
        'new-body-part': 'Neue Körperpartie',
        'new-location': 'Neuer Ort',
        'copy-week-forward': 'In die nächste Woche kopieren',
        'week-copied': 'Workouts in die nächste Woche kopiert!',
        'last-measurement': 'Letzte Messung: {weight}, {height} ({date})',
        'no-data': 'Keine Daten',
        'no-data-period': 'Keine Daten für diesen Zeitraum',
        'fill-required': 'Bitte alle Pflichtfelder ausfüllen!',
        'future-date-error': 'Keine zukünftige Messung erlaubt!',
        'no-copied-day': 'Kein kopierter Tag gefunden!',
        'paste-error': 'Fehler beim Einfügen!',
    },
    pt: {
        'workout-plan': 'Plano de Treino',
        'body-tracking': 'Acompanhamento Corporal',
        'measurements': 'Medições',
        'bmi': 'Índice de Massa Corporal',
        'bmi-underweight': 'ABAIXO DO PESO',
        'bmi-normal': 'NORMAL',
        'bmi-overweight': 'SOBREPESO',
        'bmi-obese': 'OBESIDADE',
        'bmi-severely-obese': 'OBESIDADE MÓRBIDA',
        'monday': 'Segunda-feira',
        'tuesday': 'Terça-feira',
        'wednesday': 'Quarta-feira',
        'thursday': 'Quinta-feira',
        'friday': 'Sexta-feira',
        'saturday': 'Sábado',
        'sunday': 'Domingo',
        'add-workout': 'Adicionar Exercício',
        'edit-workout': 'Editar Exercício',
        'workout-name': 'Nome do Exercício',
        'select-or-create': 'Selecionar ou Criar Novo',
        'add-new': '+ Adicionar Novo',
        'workout-icon': 'Ícone do Exercício',
        'body-part': 'Parte do Corpo',
        'workout-type': 'Tipo de Exercício',
        'time-based': 'Baseado em Tempo',
        'rep-based': 'Baseado em Repetições',
        'duration': 'Duração (minutos)',
        'sets': 'Séries',
        'reps': 'Repetições',
        'rest-time': 'Tempo de Descanso (segundos)',
        'location': 'Onde?',
        'cancel': 'Cancelar',
        'save': 'Salvar',
        'weight-chart': 'Gráfico de Peso',
        'copy-day': 'Copiar Dia',
        'paste-day': 'Colar no Dia',
        'edit': 'Editar',
        'delete': 'Excluir',
        'workout-saved': 'Exercício salvo com sucesso!',
        'workout-updated': 'Exercício atualizado com sucesso!',
        'workout-deleted': 'Exercício excluído com sucesso!',
        'measurement-saved': 'Medições salvas com sucesso!',
        'day-copied': 'Dia copiado com sucesso!',
        'day-pasted': 'Dia colado com sucesso!',
        'weight-label': 'Peso',
        'height-label': 'Altura',
        'unit-kg': 'KG',
        'unit-lb': 'LB',
        'unit-cm': 'CM',
        'unit-ftin': 'FT/IN',
        'unit-kg-short': 'kg',
        'unit-lb-short': 'lb',
        'unit-cm-short': 'cm',
        'unit-ft-short': 'ft',
        'unit-in-short': 'in',
        'feet-label': 'Pés',
        'inches-label': 'Polegadas',
        'settings': 'Configurações',
        'theme': 'Tema',
        'switch-to-light': 'Mudar para modo claro',
        'switch-to-dark': 'Mudar para modo escuro',
        'language': 'Idioma',
        'delete-data': 'Excluir dados',
        'confirm-delete-message': 'Tem certeza de que deseja excluir todos os dados?',
        'confirm': 'Sim',
        'data-cleared': 'Todos os dados foram excluídos!',
        'new-workout-name': 'Novo nome de exercício',
        'new-body-part': 'Nova parte do corpo',
        'new-location': 'Novo local',
        'copy-week-forward': 'Copiar para a próxima semana',
        'week-copied': 'Treinos copiados para a próxima semana!',
        'last-measurement': 'Última medição: {weight}, {height} ({date})',
        'no-data': 'Sem dados',
        'no-data-period': 'Sem dados neste período',
        'fill-required': 'Preencha todos os campos obrigatórios!',
        'future-date-error': 'Não é possível adicionar medição futura!',
        'no-copied-day': 'Nenhum dia copiado encontrado!',
        'paste-error': 'Erro ao colar!',
    },
    it: {
        'workout-plan': 'Piano di Allenamento',
        'body-tracking': 'Tracciamento Corporeo',
        'measurements': 'Misurazioni',
        'bmi': 'Indice di Massa Corporea',
        'bmi-underweight': 'SOTTOPESO',
        'bmi-normal': 'NORMALE',
        'bmi-overweight': 'SOVRAPPESO',
        'bmi-obese': 'OBESO',
        'bmi-severely-obese': 'OBESITÀ GRAVE',
        'monday': 'Lunedì',
        'tuesday': 'Martedì',
        'wednesday': 'Mercoledì',
        'thursday': 'Giovedì',
        'friday': 'Venerdì',
        'saturday': 'Sabato',
        'sunday': 'Domenica',
        'add-workout': 'Aggiungi Esercizio',
        'edit-workout': 'Modifica Esercizio',
        'workout-name': 'Nome Esercizio',
        'select-or-create': 'Seleziona o Crea Nuovo',
        'add-new': '+ Aggiungi Nuovo',
        'workout-icon': 'Icona Esercizio',
        'body-part': 'Parte del Corpo',
        'workout-type': 'Tipo di Esercizio',
        'time-based': 'Basato sul Tempo',
        'rep-based': 'Basato sulle Ripetizioni',
        'duration': 'Durata (minuti)',
        'sets': 'Serie',
        'reps': 'Ripetizioni',
        'rest-time': 'Tempo di Riposo (secondi)',
        'location': 'Dove?',
        'cancel': 'Annulla',
        'save': 'Salva',
        'weight-chart': 'Grafico del Peso',
        'copy-day': 'Copia Giorno',
        'paste-day': 'Incolla nel Giorno',
        'edit': 'Modifica',
        'delete': 'Elimina',
        'workout-saved': 'Esercizio salvato con successo!',
        'workout-updated': 'Esercizio aggiornato con successo!',
        'workout-deleted': 'Esercizio eliminato con successo!',
        'measurement-saved': 'Misurazioni salvate con successo!',
        'day-copied': 'Giorno copiato con successo!',
        'day-pasted': 'Giorno incollato con successo!',
        'weight-label': 'Peso',
        'height-label': 'Altezza',
        'unit-kg': 'KG',
        'unit-lb': 'LB',
        'unit-cm': 'CM',
        'unit-ftin': 'FT/IN',
        'unit-kg-short': 'kg',
        'unit-lb-short': 'lb',
        'unit-cm-short': 'cm',
        'unit-ft-short': 'ft',
        'unit-in-short': 'in',
        'feet-label': 'Piedi',
        'inches-label': 'Pollici',
        'settings': 'Impostazioni',
        'theme': 'Tema',
        'switch-to-light': 'Passa alla modalità chiara',
        'switch-to-dark': 'Passa alla modalità scura',
        'language': 'Lingua',
        'week-start': 'Inizio settimana',
        'week-start-label': 'La settimana inizia: {day}',
        'gender': 'Sesso',
        'male': 'Uomo',
        'female': 'Donna',
        'age': 'Età',
        'body-fat': 'Grasso corporeo stimato',
        'delete-data': 'Elimina dati',
        'confirm-delete-message': 'Sei sicuro di voler eliminare tutti i dati?',
        'confirm': 'Sì',
        'data-cleared': 'Tutti i dati sono stati eliminati!',
        'new-workout-name': 'Nuovo nome esercizio',
        'new-body-part': 'Nuova parte del corpo',
        'new-location': 'Nuova posizione',
        'copy-week-forward': 'Copia alla prossima settimana',
        'week-copied': 'Allenamenti copiati alla prossima settimana!',
        'last-measurement': 'Ultima misurazione: {weight}, {height} ({date})',
        'no-data': 'Nessun dato',
        'no-data-period': 'Nessun dato per questo periodo',
        'fill-required': 'Compila tutti i campi obbligatori!',
        'future-date-error': 'Non puoi aggiungere una misurazione futura!',
        'no-copied-day': 'Nessun giorno copiato trovato!',
        'paste-error': "Errore durante l'incolla!",
    }
};

// Extend translations with additional keys used by new features
(function(){
  const ext = {
    en: {
      'bmr': 'Basal Metabolic Rate',
      'activity-level': 'Activity Level',
      'daily-calories': 'Daily Calorie Need',
      'act-sedentary': 'Very little activity (desk)',
      'act-light': 'Lightly active (1–3 workouts/week)',
      'act-moderate': 'Moderately active (3–5)',
      'act-very': 'Very active (6+)',
      'act-super': 'Super active (2/day or heavy work)',
      'metric-weight': 'Weight',
      'metric-waist': 'Waist',
      'metric-hip': 'Hip',
      'metric-neck': 'Neck',
      'metric-bmi': 'BMI',
      'metric-bodyfat': 'Body Fat %',
    },
    tr: {
      'bmr': 'Bazal Metabolizma Hızı',
      'activity-level': 'Aktivite Düzeyi',
      'daily-calories': 'Günlük Kalori İhtiyacı',
      'act-sedentary': 'Çok az hareket (masa başı)',
      'act-light': 'Hafif aktif (haftada 1–3)',
      'act-moderate': 'Orta aktif (3–5)',
      'act-very': 'Çok aktif (6+)',
      'act-super': 'Süper aktif (günde 2 idman/ağır iş)',
      'metric-weight': 'Kilo',
      'metric-waist': 'Bel',
      'metric-hip': 'Kalça',
      'metric-neck': 'Boyun',
      'metric-bmi': 'VKE',
      'metric-bodyfat': 'Yağ Oranı %',
    }
  };
  Object.keys(ext).forEach(k => { if (translations[k]) Object.assign(translations[k], ext[k]); });
})();

/* default dropdown seeds per dil */
const defaultBodyPartsByLang = {
    tr: ['Göğüs', 'Sırt', 'Bacak', 'Kol', 'Omuz', 'Kardiyo'],
    en: ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Cardio'],
    fr: ['Poitrine', 'Dos', 'Jambes', 'Bras', 'Épaules', 'Cardio'],
    es: ['Pecho', 'Espalda', 'Piernas', 'Brazos', 'Hombros', 'Cardio'],
    de: ['Brust', 'Rücken', 'Beine', 'Arme', 'Schultern', 'Cardio'],
    pt: ['Peito', 'Costas', 'Pernas', 'Braços', 'Ombros', 'Cardio'],
    it: ['Petto', 'Schiena', 'Gambe', 'Braccia', 'Spalle', 'Cardio']
};

const defaultLocationsByLang = {
    tr: ['Ev', 'Spor Salonu'],
    en: ['Home', 'Gym'],
    fr: ['Maison', 'Salle de sport'],
    es: ['Casa', 'Gimnasio'],
    de: ['Zuhause', 'Fitnessstudio'],
    pt: ['Casa', 'Academia'],
    it: ['Casa', 'Palestra']
};

/* =========================
   INIT
========================= */
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadFromLocalStorage();
    setupEventListeners();
    renderWeek();
    setTodayDate();
    setupMeasurementDatePicker();
});

/* =========================
   HELPERS
========================= */
function parseLocalDate(str) {
    // str: "YYYY-MM-DD" -> local Date at midnight
    const [y,m,d] = str.split('-').map(Number);
    return new Date(y, m-1, d);
}

function getMinAllowedDate() {
    const min = new Date();
    min.setHours(0,0,0,0);
    min.setDate(min.getDate() - MEASUREMENT_KEEP_DAYS);
    return min;
}

function pruneOldMeasurements() {
    if (!Array.isArray(measurementData)) return;
    const minDate = getMinAllowedDate();
    measurementData = measurementData.filter(e => {
        const d = parseLocalDate(e.date || '');
        return d >= minDate;
    });
}

function initializeApp() {
    // theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);

    // language
    const savedLanguage = localStorage.getItem('language') || 'en';
    setLanguage(savedLanguage);

    initializeUnitPreferences();

    // week start preference
    const savedWeekStart = localStorage.getItem('weekStart');
    if (savedWeekStart !== null) {
        const parsed = parseInt(savedWeekStart);
        if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 6) {
            weekStart = parsed;
        }
    }

    // prune any measurements older than the keep window
    pruneOldMeasurements();

    // chart metric
    const savedMetric = localStorage.getItem('chartMetric');
    if (savedMetric) currentChartMetric = savedMetric;
    const savedActivity = parseFloat(localStorage.getItem('activityLevel'));
    if (!Number.isNaN(savedActivity)) currentActivityLevel = savedActivity;

    // ensure structure for current week
    const weekKey = getWeekKey(currentWeekOffset);
    if (!workouts[weekKey]) workouts[weekKey] = {};
    for (let i=0; i<7; i++) {
        if (!workouts[weekKey][i]) workouts[weekKey][i] = [];
    }
}

function initializeUnitPreferences() {
    const savedWeightUnit = localStorage.getItem('weightUnit');
    if (savedWeightUnit === 'lb') {
        currentWeightUnit = 'lb';
    }

    const savedHeightUnit = localStorage.getItem('heightUnit');
    if (savedHeightUnit === 'ftin') {
        currentHeightUnit = 'ftin';
    }

    updateWeightUnitUI(true);
    updateHeightUnitUI(true);
    updateLastMeasurementInfo();
}

function loadFromLocalStorage() {
    try {
        const savedWorkouts = localStorage.getItem('workouts');
        if (savedWorkouts) {
            workouts = JSON.parse(savedWorkouts);
        }
    } catch (err) {
        workouts = {};
    }

    try {
        const savedMeasurementData = localStorage.getItem('measurementData');
        if (savedMeasurementData) {
            measurementData = JSON.parse(savedMeasurementData);
        }
    } catch (err) {
        measurementData = [];
    }
    pruneOldMeasurements();
}

function saveToLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(workouts));
    localStorage.setItem('measurementData', JSON.stringify(measurementData));
    localStorage.setItem('weekStart', String(weekStart));
}

/* =========================
   EVENT LISTENERS
========================= */
function setupEventListeners() {
    document.getElementById('workoutPlanBtn').addEventListener('click', () => switchPage('workout-plan'));
    document.getElementById('bodyTrackingBtn').addEventListener('click', () => switchPage('body-tracking'));

    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            toggleTheme();
        });
    }
    const copyWeekBtn = document.getElementById('copyWeekBtn');
    if (copyWeekBtn) {
        copyWeekBtn.addEventListener('click', copyWeekToNext);
    }

    const settingsToggle = document.getElementById('settingsToggle');
    if (settingsToggle) {
        settingsToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSettingsPanel();
        });
    }

    document.querySelectorAll('.language-option').forEach(opt => {
        opt.addEventListener('click', () => {
            const lang = opt.dataset.lang;
            if (lang) {
                setLanguage(lang);
                closeSettingsPanel();
            }
        });
    });

    const deleteDataBtn = document.getElementById('deleteDataBtn');
    if (deleteDataBtn) {
        deleteDataBtn.addEventListener('click', openConfirmDeleteModal);
    }

    // Week start toggle button (cycles days)
    const weekStartBtn = document.getElementById('weekStartBtn');
    if (weekStartBtn) {
        weekStartBtn.addEventListener('click', () => {
            weekStart = (weekStart + 1) % 7; // 0..6
            saveToLocalStorage();
            updateWeekStartLabel();
            renderWeek();
        });
        updateWeekStartLabel();
    }

    // Export / Import
    const exportBtn = document.getElementById('exportDataBtn');
    if (exportBtn) exportBtn.addEventListener('click', exportDataToFile);
    const importBtn = document.getElementById('importDataBtn');
    const importFileInput = document.getElementById('importFileInput');
    if (importBtn && importFileInput) {
        importBtn.addEventListener('click', () => importFileInput.click());
        importFileInput.addEventListener('change', async (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            try {
                const text = await file.text();
                const data = JSON.parse(text);
                importDataFromObject(data);
                showNotification((translations[currentLanguage] && translations[currentLanguage]['import-success']) || 'Import completed');
            } catch (err) {
                showNotification((translations[currentLanguage] && translations[currentLanguage]['import-failed']) || 'Import failed', 'error');
            } finally {
                e.target.value = '';
            }
        });
    }

    // Gender toggle buttons
    document.querySelectorAll('.gender-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.gender-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateGenderDependentUI();
            updateMeasurementPlaceholders();
        });
    });

    // Measurement help icons (hover + click)
    document.querySelectorAll('.info-icon').forEach(icon => {
        const handler = () => showMeasurementHelp(icon.dataset.help, icon);
        icon.addEventListener('click', handler);
        icon.addEventListener('mouseenter', handler);
        icon.addEventListener('mouseleave', () => hideMeasurementHelpSoon());
    });

    document.getElementById('confirmDeleteCancel').addEventListener('click', closeConfirmDeleteModal);
    document.getElementById('confirmDeleteConfirm').addEventListener('click', performDataDeletion);
    document.getElementById('confirmDeleteModal').addEventListener('click', e => {
        if (e.target === e.currentTarget) closeConfirmDeleteModal();
    });

    document.getElementById('prevWeekBtn').addEventListener('click', () => {
        currentWeekOffset--;
        renderWeek();
    });
    document.getElementById('nextWeekBtn').addEventListener('click', () => {
        currentWeekOffset++;
        renderWeek();
    });

    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('workoutModal').addEventListener('click', e => {
        if (e.target === e.currentTarget) closeModal();
    });

    document.getElementById('workoutForm').addEventListener('submit', saveWorkout);

    document.querySelectorAll('input[name="workoutType"]').forEach(r => {
        r.addEventListener('change', toggleWorkoutTypeOptions);
    });

    document.querySelectorAll('.icon-option').forEach(opt => {
        opt.addEventListener('click', selectIcon);
    });

    document.getElementById('saveMeasurementBtn').addEventListener('click', saveMeasurement);

    document.querySelectorAll('.unit-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const unit = tab.dataset.unit;
            const type = tab.dataset.type;
            if (!unit || !type) return;
            if (type === 'weight') {
                setWeightUnit(unit);
            } else if (type === 'height') {
                setHeightUnit(unit);
            }
        });
    });

    // global click: close menus
    document.addEventListener('click', e => {
        if (!e.target.closest('.day-menu')) {
            document.querySelectorAll('.day-menu-dropdown').forEach(d => d.classList.remove('show'));
        }
        if (!e.target.closest('.workout-actions-row')) {
            closeWorkoutMenus();
        }
        if (!e.target.closest('.settings-wrapper')) {
            closeSettingsPanel();
        }
        if (!e.target.closest('.chart-metric-wrapper')) {
            const dd = document.getElementById('chartMetricDropdown');
            if (dd) dd.classList.remove('show');
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeConfirmDeleteModal();
            closeSettingsPanel();
        }
    });

    // Chart metric dropdown
    const chartToggle = document.getElementById('chartMetricToggle');
    const chartDD = document.getElementById('chartMetricDropdown');
    if (chartToggle && chartDD) {
        chartToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            chartDD.classList.toggle('show');
        });
        chartDD.querySelectorAll('.chart-metric-option').forEach(opt => {
            opt.addEventListener('click', () => {
                const m = opt.dataset.metric;
                if (m) {
                    currentChartMetric = m;
                    localStorage.setItem('chartMetric', m);
                    updateChartMetricUI();
                    updateChart();
                }
                chartDD.classList.remove('show');
            });
        });
        updateChartMetricUI();
    }

    // Activity select
    const activitySelect = document.getElementById('activitySelect');
    if (activitySelect) {
        activitySelect.value = String(currentActivityLevel);
        activitySelect.addEventListener('change', () => {
            const val = parseFloat(activitySelect.value);
            if (!Number.isNaN(val)) {
                currentActivityLevel = val;
                localStorage.setItem('activityLevel', String(val));
                updateBMI();
            }
        });
    }
}

/* =========================
   DATE PICKER (offline, localized)
========================= */
function setupMeasurementDatePicker() {
    const input = document.getElementById('measurementDateInput');
    if (!input) return;
    input.addEventListener('click', () => openDatePicker(input));
}

function formatDateForDisplay(iso) {
    if (!iso) return '';
    const d = parseLocalDate(iso);
    return d.toLocaleDateString(getLanguageCode());
}

let activeDatePicker = null;
let activeDatePickerDocListener = null;
function openDatePicker(anchor) {
    closeDatePicker();

    const isoHidden = document.getElementById('measurementDateISO');
    const current = isoHidden && isoHidden.value ? parseLocalDate(isoHidden.value) : new Date();
    const state = { year: current.getFullYear(), month: current.getMonth() };

    const overlay = document.createElement('div');
    overlay.className = 'datepicker-overlay';

    const panel = document.createElement('div');
    panel.className = 'datepicker-panel';

    const header = document.createElement('div');
    header.className = 'datepicker-header';
    const prev = document.createElement('button'); prev.type = 'button'; prev.textContent = '<';
    const next = document.createElement('button'); next.type = 'button'; next.textContent = '>';
    const title = document.createElement('div'); title.className = 'datepicker-title';
    header.appendChild(prev); header.appendChild(title); header.appendChild(next);

    const grid = document.createElement('div');
    grid.className = 'datepicker-grid';

    function render() {
        title.textContent = new Date(state.year, state.month, 1)
            .toLocaleDateString(getLanguageCode(), { month: 'long', year: 'numeric' });
        grid.innerHTML = '';
        // Weekday headers
        const weekdays = [];
        for (let i=0;i<7;i++) {
            const wd = new Date(2024, 0, 7 + i); // Sun..Sat baseline
            weekdays.push(wd.toLocaleDateString(getLanguageCode(), { weekday: 'short' }));
        }
        weekdays.forEach(w => {
            const el = document.createElement('div'); el.className = 'dp-weekday'; el.textContent = w; grid.appendChild(el);
        });
        const firstDay = new Date(state.year, state.month, 1);
        const startOffset = firstDay.getDay(); // 0 Sun..6 Sat
        const daysInMonth = new Date(state.year, state.month + 1, 0).getDate();
        for (let i=0;i<startOffset;i++) {
            const pad = document.createElement('div'); pad.className = 'dp-pad'; grid.appendChild(pad);
        }
        for (let d=1; d<=daysInMonth; d++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'dp-day';
            btn.textContent = String(d);
            const cellDate = new Date(state.year, state.month, d);
            const minAllowed = getMinAllowedDate();
            const today = new Date();
            today.setHours(23,59,59,999);
            if (cellDate < minAllowed || cellDate > today) {
                btn.disabled = true;
            }
            btn.addEventListener('click', () => {
                const iso = `${state.year}-${String(state.month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
                const hidden = document.getElementById('measurementDateISO');
                const display = document.getElementById('measurementDateInput');
                if (hidden) hidden.value = iso;
                if (display) display.value = formatDateForDisplay(iso);
                closeDatePicker();
            });
            grid.appendChild(btn);
        }
    }
    render();

    prev.addEventListener('click', () => { state.month -= 1; if (state.month < 0) { state.month = 11; state.year -= 1; } render(); });
    next.addEventListener('click', () => { state.month += 1; if (state.month > 11) { state.month = 0; state.year += 1; } render(); });

    panel.appendChild(header);
    panel.appendChild(grid);
    overlay.appendChild(panel);

    document.body.appendChild(overlay);
    positionDatePicker(anchor, panel);
    activeDatePicker = overlay;

    setTimeout(() => {
        function onDocClick(ev) {
            if (!panel.contains(ev.target) && ev.target !== anchor) {
                closeDatePicker();
            }
        }
        activeDatePickerDocListener = onDocClick;
        document.addEventListener('mousedown', onDocClick);
    }, 0);
}

function positionDatePicker(anchor, panel) {
    const rect = anchor.getBoundingClientRect();
    panel.style.position = 'absolute';
    panel.style.left = Math.min(rect.left, window.innerWidth - panel.offsetWidth - 10) + 'px';
    panel.style.top = (rect.bottom + window.scrollY + 6) + 'px';
}

function closeDatePicker() {
    if (activeDatePicker && activeDatePicker.parentNode) {
        activeDatePicker.parentNode.removeChild(activeDatePicker);
    }
    if (activeDatePickerDocListener) {
        document.removeEventListener('mousedown', activeDatePickerDocListener);
        activeDatePickerDocListener = null;
    }
    activeDatePicker = null;
}

/* =========================
   PAGE SWITCH
========================= */
function switchPage(pageId) {
    document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    if (pageId === 'body-tracking') {
        if (!chartInitialized) {
            setTimeout(() => {
                initializeChart();
                updateChart();
                updateBMI();
            }, 50);
        } else {
            setTimeout(() => {
                updateChart();
                updateBMI();
            }, 50);
        }
    }
}

/* =========================
   LANGUAGE / THEME
========================= */
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);

    const langLabel = document.getElementById('langLabel');
    if (langLabel) {
        langLabel.textContent = lang.toUpperCase();
    }

    document.querySelectorAll('.language-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === lang);
    });

    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        const dict = translations[lang] || {};
        if (dict[key]) {
            if (el.tagName === 'INPUT' && el.type === 'text') {
                el.placeholder = dict[key];
            } else {
                el.textContent = dict[key];
            }
        }
    });

    // Update document and date input locale for native pickers
    const htmlLang = getLanguageCode();
    if (htmlLang) {
        document.documentElement.setAttribute('lang', htmlLang);
        const dateInput = document.getElementById('measurementDateInput');
        if (dateInput) dateInput.setAttribute('lang', htmlLang);
    }

    sortLanguageOptions();
    updateWeightUnitUI(true);
    updateHeightUnitUI(true);
    updateModalPlaceholders();
    setTheme(currentTheme);

    renderWeek();
    updateLastMeasurementInfo();
    updateBMI();
    updateWeekStartLabel();
    updateGenderDependentUI();
    updateChartMetricUI();
    // Re-render measurement date display according to language
    const iso = document.getElementById('measurementDateISO');
    const display = document.getElementById('measurementDateInput');
    if (iso && display) display.value = formatDateForDisplay(iso.value);
}

function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('theme', theme);

    document.documentElement.setAttribute('data-theme', theme);

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        const labelSpan = document.getElementById('themeToggleLabel');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        if (labelSpan) {
            const labelKey = theme === 'dark' ? 'switch-to-light' : 'switch-to-dark';
            labelSpan.textContent = (translations[currentLanguage] || {})[labelKey]
                || (theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
        }
    }

    if (chartInitialized) {
        updateChart();
    }
}

function getLanguageCode() {
    const map = {
        tr: 'tr-TR',
        en: 'en-US',
        fr: 'fr-FR',
        es: 'es-ES',
        de: 'de-DE',
        pt: 'pt-BR',
        it: 'it-IT'
    };
    return map[currentLanguage] || 'en-US';
}

// Localized weekday name by index where 0=Sunday..6=Saturday
function localizedWeekdayName(index0Sunday) {
    const keys = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const key = keys[(index0Sunday % 7 + 7) % 7];
    const dict = translations[currentLanguage] || translations['en'];
    return dict[key] || key;
}

function updateWeekStartLabel() {
    const el = document.getElementById('weekStartLabel');
    if (!el) return;
    const dict = translations[currentLanguage] || translations['en'];
    const tmpl = dict['week-start-label'] || 'Week starts on: {day}';
    el.textContent = tmpl.replace('{day}', localizedWeekdayName(weekStart));
}

function updateChartMetricUI() {
    const label = document.getElementById('chartMetricLabel');
    if (!label) return;
    const dict = translations[currentLanguage] || {};
    const keyMap = {
        weight: 'metric-weight',
        waist: 'metric-waist',
        hip: 'metric-hip',
        neck: 'metric-neck',
        bmi: 'metric-bmi',
        bodyfat: 'metric-bodyfat'
    };
    const k = keyMap[currentChartMetric] || 'metric-weight';
    label.textContent = dict[k] || label.textContent;
}

/* =========================
   WEEK RENDERING
========================= */
function getWeekKey(weekOffset) {
    // monday of the shown week
    const today = new Date();
    const dow = today.getDay(); // 0 Sun..6 Sat
    const mondayOffset = dow === 0 ? 6 : dow - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - mondayOffset + (weekOffset * 7));
    return monday.toISOString().split('T')[0];
}

function renderWeek() {
    const daysContainer = document.getElementById('daysContainer');
    daysContainer.innerHTML = '';

    const today = new Date();
    const dow = today.getDay(); // 0 Sun..6 Sat
    const mondayOffset = dow === 0 ? 6 : dow - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - mondayOffset + (currentWeekOffset * 7));

    // workouts structure ensure
    const weekKey = getWeekKey(currentWeekOffset);
    if (!workouts[weekKey]) workouts[weekKey] = {};
    for (let i=0; i<7; i++){
        if (!workouts[weekKey][i]) workouts[weekKey][i] = [];
    }

    // header week text adapted to user preference
    const displayStart = new Date(monday);
    displayStart.setDate(monday.getDate() + (weekStart - 1));
    const displayEnd = new Date(displayStart);
    displayEnd.setDate(displayStart.getDate() + 6);

    const opts = { day: 'numeric', month: 'short' };
    const startText = displayStart.toLocaleDateString(getLanguageCode(), opts);
    const endText = displayEnd.toLocaleDateString(getLanguageCode(), opts);

    document.getElementById('weekDisplay').textContent = `${startText} - ${endText}`;

    const dayKeys = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
    const shift = (weekStart - 1 + 7) % 7; // display index -> storage index

    for (let i=0; i<7; i++) {
        const storeIndex = (i + shift) % 7;
        const dayDate = new Date(displayStart);
        dayDate.setDate(displayStart.getDate() + i);

        const col = document.createElement('div');
        col.className = 'day-column';
        col.dataset.dayIndex = storeIndex;

        // header
        const header = document.createElement('div');
        header.className = 'day-header';

        const topRow = document.createElement('div');
        topRow.className = 'day-header-top-row';

        const titleEl = document.createElement('div');
        titleEl.className = 'day-title';
        titleEl.textContent = translations[currentLanguage][dayKeys[storeIndex]];

        const dayMenuWrapper = document.createElement('div');
        dayMenuWrapper.className = 'day-menu';

        const dayMenuBtn = document.createElement('button');
        dayMenuBtn.className = 'day-menu-btn';
        dayMenuBtn.innerHTML = '<i class="fas fa-ellipsis-v"></i>';

        const dayMenuDropdown = document.createElement('div');
        dayMenuDropdown.className = 'day-menu-dropdown';

        const copyDayOption = document.createElement('div');
        copyDayOption.className = 'day-menu-option';
        copyDayOption.textContent = translations[currentLanguage]['copy-day'];
        copyDayOption.addEventListener('click', () => {
            copyDay(storeIndex);
            dayMenuDropdown.classList.remove('show');
        });

        const pasteDayOption = document.createElement('div');
        pasteDayOption.className = 'day-menu-option';
        pasteDayOption.textContent = translations[currentLanguage]['paste-day'];
        pasteDayOption.addEventListener('click', () => {
            pasteDay(storeIndex);
            dayMenuDropdown.classList.remove('show');
        });

        dayMenuDropdown.appendChild(copyDayOption);
        dayMenuDropdown.appendChild(pasteDayOption);

        dayMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllDayMenus();
            dayMenuDropdown.classList.toggle('show');
        });

        dayMenuWrapper.appendChild(dayMenuBtn);
        dayMenuWrapper.appendChild(dayMenuDropdown);

        topRow.appendChild(titleEl);
        topRow.appendChild(dayMenuWrapper);

        const dateEl = document.createElement('div');
        dateEl.className = 'day-date';
        dateEl.textContent = dayDate.toLocaleDateString(getLanguageCode(), {
            day: 'numeric',
            month: 'long'
        });

        header.appendChild(topRow);
        header.appendChild(dateEl);
        header.dataset.dayIndex = storeIndex;
        setupHeaderDropZone(header);

        // workouts list
        const workoutsContainer = document.createElement('div');
        workoutsContainer.className = 'workouts-container';
        workoutsContainer.dataset.dayIndex = storeIndex;

        // add workout btn
        const addBtn = document.createElement('button');
        addBtn.className = 'add-workout-btn';
        addBtn.innerHTML = `<i class="fas fa-plus"></i> ${translations[currentLanguage]['add-workout']}`;
        addBtn.addEventListener('click', () => openModal(storeIndex));

        // summary
        const summary = document.createElement('div');
        summary.className = 'day-summary';
        summary.dataset.dayIndex = storeIndex;

        // assemble
        col.appendChild(header);
        col.appendChild(workoutsContainer);
        col.appendChild(addBtn);
        col.appendChild(summary);

        daysContainer.appendChild(col);

        setupDragAndDrop(workoutsContainer);
        renderDayWorkouts(storeIndex);
    }
}

function closeAllDayMenus() {
    document.querySelectorAll('.day-menu-dropdown').forEach(m => m.classList.remove('show'));
}

/* =========================
   WORKOUTS RENDER
========================= */
function renderDayWorkouts(dayIndex) {
    const weekKey = getWeekKey(currentWeekOffset);
    const list = workouts[weekKey][dayIndex];

    const container = document.querySelector(`.workouts-container[data-day-index="${dayIndex}"]`);
    container.innerHTML = '';

    list.forEach((workout, wIndex) => {
        const card = createWorkoutCard(workout, dayIndex, wIndex);
        container.appendChild(card);
    });

    updateDaySummary(dayIndex);

    // Toggle empty hint style for drop zone
    if (list.length === 0) container.classList.add('empty');
    else container.classList.remove('empty');
}

function createWorkoutCard(workout, dayIndex, workoutIndex) {
    const card = document.createElement('div');
    card.className = 'workout-card';
    if (workout.completed) card.classList.add('completed');
    card.draggable = true;
    card.dataset.dayIndex = dayIndex;
    card.dataset.workoutIndex = workoutIndex;

    const mainRow = document.createElement('div');
    mainRow.className = 'workout-main-row';

    const leftPart = document.createElement('div');
    leftPart.className = 'workout-left';

    const iconEl = document.createElement('div');
    iconEl.className = 'workout-icon';
    iconEl.innerHTML = `<i class="fas ${workout.icon}"></i>`;

    const nameEl = document.createElement('div');
    nameEl.className = 'workout-name';
    nameEl.textContent = workout.name;

    leftPart.appendChild(iconEl);
    leftPart.appendChild(nameEl);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'workout-checkbox';
    checkbox.checked = workout.completed || false;
    checkbox.addEventListener('change', (e) => {
        e.stopPropagation();
        toggleWorkoutCompletion(dayIndex, workoutIndex);
    });

    mainRow.appendChild(leftPart);
    mainRow.appendChild(checkbox);

    // details panel
    const details = document.createElement('div');
    details.className = 'workout-details';

    const stats = document.createElement('div');
    stats.className = 'workout-stats';
    if (workout.type === 'time') {
        const minWord = translations[currentLanguage]['duration'].split(' ')[1] || 'dk';
        stats.textContent = `${workout.duration || 30} ${minWord}`;
    } else {
        const setsWord = translations[currentLanguage]['sets'];
        const repsWord = translations[currentLanguage]['reps'];
        const restWord = translations[currentLanguage]['rest-time'];
        const restLabel = restWord.split(' ')[0];
        stats.textContent =
            `${workout.sets || 3} ${setsWord} × ${workout.reps || 12} ${repsWord},\n${workout.restTime || 60}s ${restLabel}`;
    }

    const tagsWrap = document.createElement('div');
    tagsWrap.className = 'workout-tags';

    const tagBody = document.createElement('span');
    tagBody.className = 'workout-tag';
    tagBody.textContent = workout.bodyPart;

    const tagLoc = document.createElement('span');
    tagLoc.className = 'workout-tag';
    tagLoc.textContent = workout.location;

    tagsWrap.appendChild(tagBody);
    tagsWrap.appendChild(tagLoc);

    const actionsRow = document.createElement('div');
    actionsRow.className = 'workout-actions-row';

    const menuBtn = document.createElement('button');
    menuBtn.className = 'workout-menu-btn';
    menuBtn.innerHTML = '<i class="fas fa-ellipsis-v"></i>';

    const menuDropdown = document.createElement('div');
    menuDropdown.className = 'workout-menu-dropdown';

    const editOption = document.createElement('button');
    editOption.className = 'workout-menu-option';
    editOption.textContent = translations[currentLanguage]['edit'];
    editOption.addEventListener('click', () => {
        editWorkout(dayIndex, workoutIndex);
        menuDropdown.classList.remove('show');
    });

    const deleteOption = document.createElement('button');
    deleteOption.className = 'workout-menu-option';
    deleteOption.textContent = translations[currentLanguage]['delete'];
    deleteOption.addEventListener('click', () => {
        deleteWorkout(dayIndex, workoutIndex);
        menuDropdown.classList.remove('show');
    });

    menuDropdown.appendChild(editOption);
    menuDropdown.appendChild(deleteOption);

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const willOpen = !menuDropdown.classList.contains('show');
        closeWorkoutMenus();
        if (willOpen) {
            menuDropdown.classList.add('show');
            handleDropdownPosition(menuDropdown, menuBtn);
        }
    });

    actionsRow.appendChild(menuBtn);
    actionsRow.appendChild(menuDropdown);

    details.appendChild(stats);
    details.appendChild(tagsWrap);
    details.appendChild(actionsRow);

    const toggleDetails = (e) => {
        if (e.target.closest('.workout-checkbox') ||
            e.target.closest('.workout-menu-btn') ||
            e.target.closest('.workout-menu-dropdown') ||
            e.target.closest('.workout-menu-option') ||
            e.target.closest('button') ||
            e.target.closest('input') ||
            e.target.closest('select') ||
            e.target.closest('textarea')) {
            return;
        }
        const isVisible = details.style.display === 'block';
        details.style.display = isVisible ? 'none' : 'block';
    };

    card.addEventListener('click', toggleDetails);

    card.appendChild(mainRow);
    card.appendChild(details);

    // drag events
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);

    return card;
}

function toggleWorkoutCompletion(dayIndex, workoutIndex) {
    const weekKey = getWeekKey(currentWeekOffset);
    const w = workouts[weekKey][dayIndex][workoutIndex];
    w.completed = !w.completed;

    renderDayWorkouts(dayIndex);
    saveToLocalStorage();
}

function editWorkout(dayIndex, workoutIndex) {
    const weekKey = getWeekKey(currentWeekOffset);
    const w = workouts[weekKey][dayIndex][workoutIndex];

    editingWorkout = w;
    editingDayIndex = dayIndex;
    editingWorkoutIndex = workoutIndex;

    openModal(dayIndex, w);
}

function deleteWorkout(dayIndex, workoutIndex) {
    const weekKey = getWeekKey(currentWeekOffset);
    workouts[weekKey][dayIndex].splice(workoutIndex, 1);

    renderDayWorkouts(dayIndex);
    saveToLocalStorage();
    showNotification(translations[currentLanguage]['workout-deleted']);
}

function closeWorkoutMenus() {
    document.querySelectorAll('.workout-menu-dropdown').forEach(d => {
        d.classList.remove('show');
        d.style.left = '';
        d.style.top = '';
        d.style.maxHeight = '';
    });
}

function toggleSettingsPanel() {
    const dropdown = document.getElementById('settingsDropdown');
    const toggle = document.getElementById('settingsToggle');
    if (!dropdown || !toggle) return;
    const willShow = !dropdown.classList.contains('show');
    if (willShow) {
        dropdown.classList.add('show');
        toggle.setAttribute('aria-expanded', 'true');
        closeWorkoutMenus();
        document.querySelectorAll('.day-menu-dropdown').forEach(d => d.classList.remove('show'));
    } else {
        dropdown.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
    }
}

function closeSettingsPanel() {
    const dropdown = document.getElementById('settingsDropdown');
    const toggle = document.getElementById('settingsToggle');
    if (dropdown) dropdown.classList.remove('show');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
}

function openConfirmDeleteModal() {
    closeSettingsPanel();
    const modal = document.getElementById('confirmDeleteModal');
    if (!modal) return;
    modal.classList.add('show');
    const confirmBtn = document.getElementById('confirmDeleteConfirm');
    if (confirmBtn) confirmBtn.focus();
}

function closeConfirmDeleteModal() {
    const modal = document.getElementById('confirmDeleteModal');
    if (!modal) return;
    modal.classList.remove('show');
    const settingsToggle = document.getElementById('settingsToggle');
    if (settingsToggle) settingsToggle.focus();
}

function performDataDeletion() {
    const wasChartInitialized = chartInitialized;
    const currentDict = translations[currentLanguage] || {};
    const clearedMessage = currentDict['data-cleared'] || 'All data deleted!';
    closeConfirmDeleteModal();
    localStorage.clear();

    workouts = {};
    measurementData = [];
    currentWeekOffset = 0;
    currentWeightUnit = 'kg';
    currentHeightUnit = 'cm';

    setLanguage('en');
    setTheme('light');
    updateWeightUnitUI(true);
    updateHeightUnitUI(true);
    setTodayDate();
    weekStart = 1;
    updateWeekStartLabel?.();
    if (wasChartInitialized) {
        updateChart();
    }
    saveToLocalStorage();

    showNotification(clearedMessage);
}

// keep dropdown on screen and always on top
function handleDropdownPosition(dropdownEl, triggerEl) {
    const margin = 8;

    dropdownEl.style.maxHeight = '';
    dropdownEl.style.left = '0px';
    dropdownEl.style.top = '0px';

    const maxHeight = Math.max(120, window.innerHeight - margin * 2);
    dropdownEl.style.maxHeight = `${maxHeight}px`;

    const dropdownWidth = dropdownEl.offsetWidth;
    const dropdownHeight = dropdownEl.offsetHeight;
    const triggerRect = triggerEl.getBoundingClientRect();

    let left = triggerRect.right - dropdownWidth;
    const maxLeft = window.innerWidth - dropdownWidth - margin;
    if (left > maxLeft) left = maxLeft;
    if (left < margin) left = margin;

    let top = triggerRect.bottom + margin;
    const maxTop = window.innerHeight - dropdownHeight - margin;
    if (top > maxTop) {
        const aboveTop = triggerRect.top - dropdownHeight - margin;
        if (aboveTop >= margin) {
            top = aboveTop;
        } else {
            top = Math.max(margin, maxTop);
        }
    }
    if (top < margin) top = margin;

    dropdownEl.style.left = `${left}px`;
    dropdownEl.style.top = `${top}px`;
}

function setupDragAndDrop(container) {
    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('drop', handleDrop);
}

function setupHeaderDropZone(headerEl) {
    headerEl.addEventListener('dragover', handleDragOver);
    headerEl.addEventListener('drop', handleDropOnHeaderTop);
}
function handleDragStart(e) {
    draggedWorkout = {
        dayIndex: parseInt(e.currentTarget.dataset.dayIndex),
        workoutIndex: parseInt(e.currentTarget.dataset.workoutIndex)
    };
    e.currentTarget.classList.add('dragging');
}
function handleDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
    draggedWorkout = null;
}
function handleDragOver(e) {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
}
function handleDrop(e) {
    e.preventDefault();
    if (!draggedWorkout) return;

    const targetDayIndex = parseInt(e.currentTarget.dataset.dayIndex);
    const weekKey = getWeekKey(currentWeekOffset);

    const sourceDayIndex = draggedWorkout.dayIndex;
    const sourceIndex = draggedWorkout.workoutIndex;
    const movedWorkout = workouts[weekKey][sourceDayIndex][sourceIndex];

    // Determine insertion index based on cursor Y relative to cards
    const container = e.currentTarget;
    const cards = Array.from(container.querySelectorAll('.workout-card'));
    const mouseY = e.clientY;
    let insertIndex = cards.length; // default to end
    for (let i = 0; i < cards.length; i++) {
        const rect = cards[i].getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        if (mouseY < midY) { insertIndex = i; break; }
    }

    // Remove from source
    workouts[weekKey][sourceDayIndex].splice(sourceIndex, 1);

    // Adjust index if reordering within same day and removing above target
    if (targetDayIndex === sourceDayIndex && insertIndex > sourceIndex) {
        insertIndex -= 1;
    }

    if (!workouts[weekKey][targetDayIndex]) workouts[weekKey][targetDayIndex] = [];
    workouts[weekKey][targetDayIndex].splice(insertIndex, 0, movedWorkout);

    renderDayWorkouts(sourceDayIndex);
    if (targetDayIndex !== sourceDayIndex) renderDayWorkouts(targetDayIndex);

    saveToLocalStorage();
    draggedWorkout = null;
}

function handleDropOnHeaderTop(e) {
    e.preventDefault();
    if (!draggedWorkout) return;
    const targetDayIndex = parseInt(e.currentTarget.dataset.dayIndex);
    const weekKey = getWeekKey(currentWeekOffset);
    const sourceDayIndex = draggedWorkout.dayIndex;
    const sourceIndex = draggedWorkout.workoutIndex;
    const movedWorkout = workouts[weekKey][sourceDayIndex][sourceIndex];

    // Remove from source
    workouts[weekKey][sourceDayIndex].splice(sourceIndex, 1);

    if (!workouts[weekKey][targetDayIndex]) workouts[weekKey][targetDayIndex] = [];
    // Insert at top
    workouts[weekKey][targetDayIndex].splice(0, 0, movedWorkout);

    renderDayWorkouts(sourceDayIndex);
    if (targetDayIndex !== sourceDayIndex) renderDayWorkouts(targetDayIndex);
    saveToLocalStorage();
    draggedWorkout = null;
}

/* =========================
   DAY SUMMARY
========================= */
function updateDaySummary(dayIndex) {
    const weekKey = getWeekKey(currentWeekOffset);
    const dayList = workouts[weekKey][dayIndex] || [];

    const summaryEl = document.querySelector(`.day-summary[data-day-index="${dayIndex}"]`);
    summaryEl.innerHTML = '';

    const counter = {};
    dayList.forEach(w => {
        const bp = w.bodyPart || '';
        if (!bp) return;
        if (!counter[bp]) counter[bp] = 0;
        counter[bp]++;
    });

    Object.keys(counter).forEach(bp => {
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        summaryItem.textContent = `${counter[bp]} ${bp}`;
        summaryEl.appendChild(summaryItem);
    });
}

/* =========================
   MODAL OPEN / POPULATE
========================= */
function openModal(dayIndex, workoutToEdit=null) {
    currentDayIndex = dayIndex;
    const modal = document.getElementById('workoutModal');
    modal.classList.add('show');

    const modalTitle = modal.querySelector('.modal-title');
    modalTitle.textContent = workoutToEdit
        ? translations[currentLanguage]['edit-workout']
        : translations[currentLanguage]['add-workout'];

    const form = document.getElementById('workoutForm');
    form.reset();
    document.getElementById('timeBasedOptions').style.display = 'block';
    document.getElementById('repBasedOptions').style.display = 'none';

    document.querySelectorAll('.icon-option').forEach(o=>o.classList.remove('selected'));

    // Always use free-text inputs (no saved lists)
    const nameInput = document.getElementById('workoutNameInput');
    const bodyInput = document.getElementById('bodyPartInput');
    const locInput = document.getElementById('locationInput');
    if (nameInput) { nameInput.style.display = 'block'; nameInput.disabled = false; nameInput.value = ''; }
    if (bodyInput) { bodyInput.style.display = 'block'; bodyInput.disabled = false; bodyInput.value = ''; }
    if (locInput)  { locInput.style.display = 'block';  locInput.disabled = false;  locInput.value = ''; }
    updateModalPlaceholders();

    if (workoutToEdit) {
        // Prefill free-text fields
        if (nameInput) nameInput.value = workoutToEdit.name || '';

        const iconOpt = document.querySelector(`.icon-option[data-icon="${workoutToEdit.icon}"]`);
        if (iconOpt) iconOpt.classList.add('selected');
        if (bodyInput) bodyInput.value = workoutToEdit.bodyPart || '';

        if (workoutToEdit.type === 'time') {
            document.getElementById('timeBased').checked = true;
            document.getElementById('durationInput').value = workoutToEdit.duration || 30;
        } else {
            document.getElementById('repBased').checked = true;
            document.getElementById('setsInput').value = workoutToEdit.sets || 3;
            document.getElementById('repsInput').value = workoutToEdit.reps || 12;
            document.getElementById('restTimeInput').value = workoutToEdit.restTime || 60;
        }
        toggleWorkoutTypeOptions();

        if (locInput) locInput.value = workoutToEdit.location || '';
    }
}

function closeModal() {
    document.getElementById('workoutModal').classList.remove('show');
    currentDayIndex = null;
    editingWorkout = null;
    editingDayIndex = null;
    editingWorkoutIndex = null;
}

function populateWorkoutNameSelect() {
    const select = document.getElementById('workoutNameSelect');
    select.innerHTML = `<option value="">${translations[currentLanguage]['select-or-create']}</option>`;

    const names = new Set();
    Object.keys(workouts).forEach(weekKey => {
        Object.keys(workouts[weekKey]).forEach(d => {
            workouts[weekKey][d].forEach(w => names.add(w.name));
        });
    });

    names.forEach(n => {
        const opt = document.createElement('option');
        opt.value = n;
        opt.textContent = n;
        select.appendChild(opt);
    });

    const addNewOpt = document.createElement('option');
    addNewOpt.value = 'add-new';
    addNewOpt.textContent = translations[currentLanguage]['add-new'];
    select.appendChild(addNewOpt);

    select.onchange = function() {
        const input = document.getElementById('workoutNameInput');
        if (!input) return;
        if (this.value === 'add-new') {
            input.style.display = 'block';
            input.disabled = false;
            input.value = '';
            input.placeholder = translations[currentLanguage]['new-workout-name'] || 'New workout name';
            input.focus();
        } else if (this.value) {
            input.style.display = 'none';
            input.disabled = true;
        } else {
            input.style.display = 'none';
            input.disabled = false;
        }
    };
}

function populateBodyPartSelect() {
    const bodyPartSelect = document.getElementById('bodyPartSelect');
    bodyPartSelect.innerHTML = `<option value="">${translations[currentLanguage]['select-or-create']}</option>`;

    const defaults = defaultBodyPartsByLang[currentLanguage] || defaultBodyPartsByLang['en'];
    const partsSet = new Set(defaults);

    Object.keys(workouts).forEach(weekKey => {
        Object.keys(workouts[weekKey]).forEach(d => {
            workouts[weekKey][d].forEach(w => {
                if (w.bodyPart) partsSet.add(w.bodyPart);
            });
        });
    });

    partsSet.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = p;
        bodyPartSelect.appendChild(opt);
    });

    const addNewOpt = document.createElement('option');
    addNewOpt.value = 'add-new';
    addNewOpt.textContent = translations[currentLanguage]['add-new'];
    bodyPartSelect.appendChild(addNewOpt);

    bodyPartSelect.onchange = function() {
        const input = document.getElementById('bodyPartInput');
        if (!input) return;
        if (this.value === 'add-new') {
            input.style.display = 'block';
            input.disabled = false;
            input.value = '';
            input.placeholder = translations[currentLanguage]['new-body-part'] || 'New body part';
            input.focus();
        } else if (this.value) {
            input.style.display = 'none';
            input.disabled = true;
        } else {
            input.style.display = 'none';
            input.disabled = false;
        }
    };
}

function populateLocationSelect() {
    const locationSelect = document.getElementById('locationSelect');
    locationSelect.innerHTML = `<option value="">${translations[currentLanguage]['select-or-create']}</option>`;

    const defaults = defaultLocationsByLang[currentLanguage] || defaultLocationsByLang['en'];
    const locSet = new Set(defaults);

    Object.keys(workouts).forEach(weekKey => {
        Object.keys(workouts[weekKey]).forEach(d => {
            workouts[weekKey][d].forEach(w => {
                if (w.location) locSet.add(w.location);
            });
        });
    });

    locSet.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l;
        opt.textContent = l;
        locationSelect.appendChild(opt);
    });

    const addNewOpt = document.createElement('option');
    addNewOpt.value = 'add-new';
    addNewOpt.textContent = translations[currentLanguage]['add-new'];
    locationSelect.appendChild(addNewOpt);

    locationSelect.onchange = function() {
        const input = document.getElementById('locationInput');
        if (!input) return;
        if (this.value === 'add-new') {
            input.style.display = 'block';
            input.disabled = false;
            input.value = '';
            input.placeholder = translations[currentLanguage]['new-location'] || 'New location';
            input.focus();
        } else if (this.value) {
            input.style.display = 'none';
            input.disabled = true;
        } else {
            input.style.display = 'none';
            input.disabled = false;
        }
    };
}

function selectIcon(e) {
    document.querySelectorAll('.icon-option').forEach(o => o.classList.remove('selected'));
    e.currentTarget.classList.add('selected');
}

function toggleWorkoutTypeOptions() {
    const isTime = document.getElementById('timeBased').checked;
    document.getElementById('timeBasedOptions').style.display = isTime ? 'block' : 'none';
    document.getElementById('repBasedOptions').style.display = isTime ? 'none' : 'block';
}

/* =========================
   SAVE WORKOUT
========================= */
function saveWorkout(e) {
    e.preventDefault();

    const workoutNameInput = document.getElementById('workoutNameInput');
    const workoutName = (workoutNameInput?.value || '').trim();

    const selectedIcon = document.querySelector('.icon-option.selected');
    const icon = selectedIcon ? selectedIcon.dataset.icon : 'fa-dumbbell';

    const bodyPartInput = document.getElementById('bodyPartInput');
    const bodyPart = (bodyPartInput?.value || '').trim();

    const workoutType = document.querySelector('input[name="workoutType"]:checked').value;

    const locationInput = document.getElementById('locationInput');
    const locationVal = (locationInput?.value || '').trim();

    if (!workoutName || !bodyPart || !locationVal) {
        showNotification(translations[currentLanguage]['fill-required'], 'error');
        return;
    }

    const wObj = {
        name: workoutName,
        icon: icon,
        bodyPart: bodyPart,
        type: workoutType,
        location: locationVal,
        completed: false
    };

    if (workoutType === 'time') {
        wObj.duration = document.getElementById('durationInput').value || 30;
    } else {
        wObj.sets = document.getElementById('setsInput').value || 3;
        wObj.reps = document.getElementById('repsInput').value || 12;
        wObj.restTime = document.getElementById('restTimeInput').value || 60;
    }

    const weekKey = getWeekKey(currentWeekOffset);

    if (editingWorkout) {
        wObj.completed = editingWorkout.completed;
        workouts[weekKey][editingDayIndex][editingWorkoutIndex] = wObj;

        renderDayWorkouts(editingDayIndex);
        showNotification(translations[currentLanguage]['workout-updated']);
    } else {
        if (!workouts[weekKey][currentDayIndex]) workouts[weekKey][currentDayIndex] = [];
        workouts[weekKey][currentDayIndex].push(wObj);

        renderDayWorkouts(currentDayIndex);
        showNotification(translations[currentLanguage]['workout-saved']);
    }

    saveToLocalStorage();
    closeModal();
}

/* =========================
   COPY / PASTE DAY
========================= */
function copyDay(dayIndex) {
    const weekKey = getWeekKey(currentWeekOffset);
    const dayWorkouts = workouts[weekKey][dayIndex] || [];

    localStorage.setItem('copiedDay', JSON.stringify(dayWorkouts));
    showNotification(translations[currentLanguage]['day-copied']);
}

function pasteDay(dayIndex) {
    const copiedDayData = localStorage.getItem('copiedDay');
    if (!copiedDayData) {
        showNotification(translations[currentLanguage]['no-copied-day'], 'error');
        return;
    }

    try {
        const parsed = JSON.parse(copiedDayData);
        const weekKey = getWeekKey(currentWeekOffset);

        workouts[weekKey][dayIndex] = parsed.map(w => ({...w, completed:false}));

        renderDayWorkouts(dayIndex);
        saveToLocalStorage();

        showNotification(translations[currentLanguage]['day-pasted']);
    } catch (err) {
        showNotification(translations[currentLanguage]['paste-error'], 'error');
    }
}

function copyWeekToNext() {
    closeSettingsPanel();
    const sourceKey = getWeekKey(currentWeekOffset);
    const targetKey = getWeekKey(currentWeekOffset + 1);

    if (!workouts[sourceKey]) {
        workouts[sourceKey] = {};
    }
    if (!workouts[targetKey]) {
        workouts[targetKey] = {};
    }

    for (let i = 0; i < 7; i++) {
        if (!workouts[sourceKey][i]) {
            workouts[sourceKey][i] = [];
        }
        const sourceDay = workouts[sourceKey][i];
        workouts[targetKey][i] = sourceDay.map(w => ({ ...w, completed: false }));
    }

    saveToLocalStorage();
    showNotification(translations[currentLanguage]['week-copied']);
}

/* =========================
   MEASUREMENTS / BMI
========================= */
function setWeightUnit(unit) {
    if (unit === currentWeightUnit) return;

    const weightInput = document.getElementById('weightInput');
    if (weightInput) {
        let currentVal = parseFloat(weightInput.value);
        if (!Number.isNaN(currentVal) && currentVal > 0) {
            if (currentWeightUnit === 'kg' && unit === 'lb') {
                currentVal = kgToLb(currentVal);
            } else if (currentWeightUnit === 'lb' && unit === 'kg') {
                currentVal = lbToKg(currentVal);
            }
            weightInput.value = formatNumber(currentVal, 1);
        }
    }

    currentWeightUnit = unit;
    updateWeightUnitUI();
    updateLastMeasurementInfo();
    if (chartInitialized) {
        updateChart();
    }
}

function updateWeightUnitUI(skipSave = false) {
    const tabs = document.querySelectorAll('.unit-tab[data-type="weight"]');
    tabs.forEach(btn => {
        const isActive = btn.dataset.unit === currentWeightUnit;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    updateMeasurementPlaceholders();

    if (!skipSave) {
        localStorage.setItem('weightUnit', currentWeightUnit);
    }
}

function setHeightUnit(unit) {
    if (unit === currentHeightUnit) return;

    const heightInput = document.getElementById('heightInput');
    const feetInput = document.getElementById('heightFeetInput');
    const inchesInput = document.getElementById('heightInchesInput');

    if (!heightInput || !feetInput || !inchesInput) {
        currentHeightUnit = unit;
        updateHeightUnitUI();
        return;
    }

    if (unit === 'ftin') {
        const cmVal = parseFloat(heightInput.value);
        if (!Number.isNaN(cmVal) && cmVal > 0) {
            const { feet, inches } = cmToFeetInches(cmVal);
            feetInput.value = feet;
            inchesInput.value = formatNumber(inches, 1);
        } else {
            feetInput.value = '';
            inchesInput.value = '';
        }
        heightInput.value = '';
    } else {
        const feetVal = parseFloat(feetInput.value);
        const inchesVal = parseFloat(inchesInput.value);
        const cmVal = feetInchesToCm(feetVal, inchesVal);
        heightInput.value = cmVal > 0 ? formatNumber(cmVal, 1) : '';
        feetInput.value = '';
        inchesInput.value = '';
    }

    currentHeightUnit = unit;
    updateHeightUnitUI();
    updateLastMeasurementInfo();
}

function updateHeightUnitUI(skipSave = false) {
    const tabs = document.querySelectorAll('.unit-tab[data-type="height"]');
    tabs.forEach(btn => {
        const isActive = btn.dataset.unit === currentHeightUnit;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    const heightInput = document.getElementById('heightInput');
    const imperialInputs = document.getElementById('heightImperialInputs');
    if (heightInput && imperialInputs) {
        const useImperial = currentHeightUnit === 'ftin';
        heightInput.classList.toggle('hidden', useImperial);
        imperialInputs.classList.toggle('active', useImperial);
    }

    updateMeasurementPlaceholders();
    updateGenderDependentUI();

    if (!skipSave) {
        localStorage.setItem('heightUnit', currentHeightUnit);
    }
    if (chartInitialized) {
        updateChart();
    }
}

function updateMeasurementPlaceholders() {
    const dict = translations[currentLanguage] || {};
    const weightInput = document.getElementById('weightInput');
    if (weightInput) {
        const label = dict['weight-label'] || 'Weight';
        const unitKey = currentWeightUnit === 'kg' ? 'unit-kg-short' : 'unit-lb-short';
        const unit = dict[unitKey] || (currentWeightUnit === 'kg' ? 'kg' : 'lb');
        weightInput.placeholder = `${label} (${unit})`;
    }

    const heightInput = document.getElementById('heightInput');
    if (heightInput) {
        const label = dict['height-label'] || 'Height';
        const unit = dict['unit-cm-short'] || 'cm';
        heightInput.placeholder = `${label} (${unit})`;
    }

    const feetInput = document.getElementById('heightFeetInput');
    if (feetInput) {
        const feetLabel = dict['feet-label'] || 'Feet';
        const ftShort = dict['unit-ft-short'] || 'ft';
        feetInput.placeholder = `${feetLabel} (${ftShort})`;
    }

    const inchesInput = document.getElementById('heightInchesInput');
    if (inchesInput) {
        const inchesLabel = dict['inches-label'] || 'Inches';
        const inShort = dict['unit-in-short'] || 'in';
        inchesInput.placeholder = `${inchesLabel} (${inShort})`;
    }

    // Circumference placeholders (waist/hip/neck) follow height unit: cm or in
    const unitCirc = currentHeightUnit === 'ftin'
        ? (dict['unit-in-short'] || 'in')
        : (dict['unit-cm-short'] || 'cm');
    const waist = document.getElementById('waistInput');
    if (waist) waist.placeholder = `${dict['waist'] || 'Waist'} (${unitCirc})`;
    const hip = document.getElementById('hipInput');
    if (hip) hip.placeholder = `${dict['hip'] || 'Hip'} (${unitCirc})`;
    const neck = document.getElementById('neckInput');
    if (neck) neck.placeholder = `${dict['neck'] || 'Neck'} (${unitCirc})`;
}

function updateGenderDependentUI() {
    const active = document.querySelector('.gender-tab.active');
    const gender = active ? active.dataset.gender : null;
    const hip = document.getElementById('hipInput');
    if (hip) {
        const isMale = gender !== 'female';
        hip.disabled = isMale;
        if (isMale) hip.value = '';
    }
}

let helpTooltipHideTimer = null;
function showMeasurementHelp(key, anchorEl) {
    const dict = translations[currentLanguage] || {};
    const map = {
        waist: dict['waist-help'] || 'Measure at the waist as described.',
        hip: dict['hip-help'] || 'Measure at the hips as described.',
        neck: dict['neck-help'] || 'Measure at the neck as described.'
    };
    const text = map[key] || '';
    if (!text) return;
    let tp = document.getElementById('helpTooltip');
    if (!tp) { tp = document.createElement('div'); tp.id = 'helpTooltip'; document.body.appendChild(tp); }
    tp.textContent = text;
    tp.style.display = 'block';
    const rect = anchorEl.getBoundingClientRect();
    const margin = 8;
    const left = Math.min(window.innerWidth - tp.offsetWidth - margin, Math.max(margin, rect.left));
    const top = rect.top + rect.height + margin;
    tp.style.left = left + 'px';
    tp.style.top = top + 'px';
    if (helpTooltipHideTimer) { clearTimeout(helpTooltipHideTimer); helpTooltipHideTimer = null; }
}
function hideMeasurementHelpSoon(delay=300) {
    if (helpTooltipHideTimer) clearTimeout(helpTooltipHideTimer);
    helpTooltipHideTimer = setTimeout(() => { const tp = document.getElementById('helpTooltip'); if (tp) tp.style.display='none'; }, delay);
}

function updateModalPlaceholders() {
    const dict = translations[currentLanguage] || {};
    const workoutNameInput = document.getElementById('workoutNameInput');
    if (workoutNameInput) {
        workoutNameInput.placeholder = dict['workout-name'] || 'Workout name';
    }
    const bodyPartInput = document.getElementById('bodyPartInput');
    if (bodyPartInput) {
        bodyPartInput.placeholder = dict['body-part'] || 'Body part';
    }
    const locationInput = document.getElementById('locationInput');
    if (locationInput) {
        locationInput.placeholder = dict['location'] || 'Location';
    }
    const copyWeekBtn = document.getElementById('copyWeekBtn');
    if (copyWeekBtn) {
        copyWeekBtn.textContent = dict['copy-week-forward'] || 'Copy To Next Week';
    }
    const deleteDataBtn = document.getElementById('deleteDataBtn');
    if (deleteDataBtn) {
        deleteDataBtn.textContent = dict['delete-data'] || 'Delete Data';
    }
    const confirmMessage = document.getElementById('confirmDeleteMessage');
    if (confirmMessage) {
        confirmMessage.textContent = dict['confirm-delete-message'] || 'Are you sure you want to delete all data?';
    }
    const confirmBtn = document.getElementById('confirmDeleteConfirm');
    if (confirmBtn) {
        confirmBtn.textContent = dict['confirm'] || 'Yes';
    }
    const cancelBtn = document.getElementById('confirmDeleteCancel');
    if (cancelBtn) {
        cancelBtn.textContent = dict['cancel'] || 'Cancel';
    }
    const settingsToggle = document.getElementById('settingsToggle');
    if (settingsToggle) {
        const label = dict['settings'] || 'Settings';
        settingsToggle.setAttribute('aria-label', label);
        settingsToggle.setAttribute('title', label);
    }
}

function formatNumber(value, decimals = 1) {
    if (!Number.isFinite(value)) return '';
    const factor = Math.pow(10, decimals);
    return (Math.round(value * factor) / factor).toString();
}

function kgToLb(value) {
    return value * KG_TO_LB;
}

function lbToKg(value) {
    return value / KG_TO_LB;
}

function feetInchesToCm(feet, inches) {
    const safeFeet = Number.isFinite(feet) && feet >= 0 ? feet : 0;
    const safeInches = Number.isFinite(inches) && inches >= 0 ? inches : 0;
    const totalInches = (safeFeet * INCHES_PER_FOOT) + safeInches;
    if (totalInches <= 0) return 0;
    return totalInches * CM_PER_INCH;
}

function cmToFeetInches(cm) {
    if (!Number.isFinite(cm) || cm <= 0) {
        return { feet: 0, inches: 0 };
    }
    const totalInches = cm / CM_PER_INCH;
    let feet = Math.floor(totalInches / INCHES_PER_FOOT);
    let inches = totalInches - feet * INCHES_PER_FOOT;
    inches = Math.round(inches * 10) / 10;
    if (inches >= INCHES_PER_FOOT) {
        feet += 1;
        inches -= INCHES_PER_FOOT;
    }
    return { feet, inches };
}

function formatWeightForDisplay(kgValue) {
    const dict = translations[currentLanguage] || {};
    if (currentWeightUnit === 'lb') {
        const unit = dict['unit-lb-short'] || 'lb';
        return `${formatNumber(kgToLb(kgValue), 1)} ${unit}`;
    }
    const unit = dict['unit-kg-short'] || 'kg';
    return `${formatNumber(kgValue, 1)} ${unit}`;
}

function formatHeightForDisplay(cmValue) {
    const dict = translations[currentLanguage] || {};
    if (currentHeightUnit === 'ftin') {
        const { feet, inches } = cmToFeetInches(cmValue);
        const ftShort = dict['unit-ft-short'] || 'ft';
        const inShort = dict['unit-in-short'] || 'in';
        const inchStr = inches > 0 ? ` ${formatNumber(inches, 1)} ${inShort}` : '';
        return `${feet} ${ftShort}${inchStr}`;
    }
    const unit = dict['unit-cm-short'] || 'cm';
    return `${formatNumber(cmValue, 1)} ${unit}`;
}

function weightToDisplayValue(kgValue) {
    return currentWeightUnit === 'lb' ? kgToLb(kgValue) : kgValue;
}

function getCurrentWeightUnitShortLabel() {
    const dict = translations[currentLanguage] || {};
    const key = currentWeightUnit === 'lb' ? 'unit-lb-short' : 'unit-kg-short';
    return dict[key] || (currentWeightUnit === 'lb' ? 'lb' : 'kg');
}

function sortLanguageOptions() {
    const container = document.getElementById('settingsLanguageOptions');
    if (!container) return;
    const options = Array.from(container.querySelectorAll('.language-option'));
    options.sort((a, b) => {
        const aText = a.textContent.trim();
        const bText = b.textContent.trim();
        return aText.localeCompare(bText, getLanguageCode(), { sensitivity: 'base' });
    });
    options.forEach(opt => container.appendChild(opt));
}

function setTodayDate() {
    const iso = new Date().toISOString().split('T')[0];
    const hidden = document.getElementById('measurementDateISO');
    const display = document.getElementById('measurementDateInput');
    if (hidden) hidden.value = iso;
    if (display) display.value = formatDateForDisplay(iso);
}

function sameDay(d1, d2) {
    const a = parseLocalDate(d1);
    const b = parseLocalDate(d2);
    return a.getTime() === b.getTime();
}

function saveMeasurement() {
    const dateVal = (document.getElementById('measurementDateISO')?.value) || '';
    const weightInput = document.getElementById('weightInput');
    const heightInput = document.getElementById('heightInput');
    const feetInput = document.getElementById('heightFeetInput');
    const inchesInput = document.getElementById('heightInchesInput');
    const waistInput = document.getElementById('waistInput');
    const hipInput = document.getElementById('hipInput');
    const neckInput = document.getElementById('neckInput');
    const selectedGenderBtn = document.querySelector('.gender-tab.active');
    const selectedGender = selectedGenderBtn ? selectedGenderBtn.dataset.gender : undefined;

    let rawWeight = parseFloat(weightInput.value);
    if (!dateVal || Number.isNaN(rawWeight) || rawWeight <= 0) {
        showNotification(translations[currentLanguage]['fill-required'], 'error');
        return;
    }

    let weightKg = currentWeightUnit === 'lb' ? lbToKg(rawWeight) : rawWeight;
    if (!Number.isFinite(weightKg) || weightKg <= 0) {
        showNotification(translations[currentLanguage]['fill-required'], 'error');
        return;
    }

    let heightCm;
    if (currentHeightUnit === 'cm') {
        const rawHeight = parseFloat(heightInput.value);
        if (Number.isNaN(rawHeight) || rawHeight <= 0) {
            showNotification(translations[currentLanguage]['fill-required'], 'error');
            return;
        }
        heightCm = rawHeight;
    } else {
        const feetValRaw = feetInput ? parseFloat(feetInput.value) : 0;
        const inchValRaw = inchesInput ? parseFloat(inchesInput.value) : 0;
        const feetVal = Number.isNaN(feetValRaw) ? 0 : feetValRaw;
        const inchVal = Number.isNaN(inchValRaw) ? 0 : inchValRaw;

        if (feetVal < 0 || inchVal < 0) {
            showNotification(translations[currentLanguage]['fill-required'], 'error');
            return;
        }

        if (feetVal === 0 && inchVal === 0) {
            showNotification(translations[currentLanguage]['fill-required'], 'error');
            return;
        }

        heightCm = feetInchesToCm(feetVal, inchVal);
        if (!Number.isFinite(heightCm) || heightCm <= 0) {
            showNotification(translations[currentLanguage]['fill-required'], 'error');
            return;
        }
    }

    // block only future beyond today (end of today local)
    const selDate = parseLocalDate(dateVal);
    const nowEnd = new Date();
    nowEnd.setHours(23,59,59,999);
    if (selDate > nowEnd) {
        showNotification(translations[currentLanguage]['future-date-error'], 'error');
        return;
    }

    // Block dates older than keep window (90 days)
    const minAllowed = getMinAllowedDate();
    if (selDate < minAllowed) {
        const msg = (translations[currentLanguage] && translations[currentLanguage]['old-date-error'])
            || 'Only the last 90 days are allowed.';
        showNotification(msg, 'error');
        return;
    }

    const weightStored = Math.round(weightKg * 100) / 100;
    const heightStored = Math.round(heightCm * 100) / 100;

    function toCmCirc(val) {
        if (!Number.isFinite(val) || val <= 0) return undefined;
        // follow height unit: cm or inches
        if (currentHeightUnit === 'ftin') {
            return Math.round((val * CM_PER_INCH) * 100) / 100;
        }
        return Math.round(val * 100) / 100;
    }

    function readCircumferences(waistEl, hipEl, neckEl) {
        const waistVal = waistEl ? parseFloat(waistEl.value) : NaN;
        const hipVal = hipEl ? parseFloat(hipEl.value) : NaN;
        const neckVal = neckEl ? parseFloat(neckEl.value) : NaN;
        return {
            waist: toCmCirc(waistVal),
            hip: toCmCirc(hipVal),
            neck: toCmCirc(neckVal)
        };
    }

    const idx = measurementData.findIndex(entry => sameDay(entry.date, dateVal));
    if (idx !== -1) {
        measurementData[idx].weight = weightStored;
        measurementData[idx].height = heightStored;
        if (selectedGender) measurementData[idx].gender = selectedGender;
        // optional circumferences
        const circ = readCircumferences(waistInput, hipInput, neckInput);
        if (circ.waist) measurementData[idx].waist = circ.waist;
        if (circ.hip !== undefined) measurementData[idx].hip = circ.hip;
        if (circ.neck) measurementData[idx].neck = circ.neck;
    } else {
        const entry = { date: dateVal, weight: weightStored, height: heightStored };
        if (selectedGender) entry.gender = selectedGender;
        const circ = readCircumferences(waistInput, hipInput, neckInput);
        if (circ.waist) entry.waist = circ.waist;
        if (circ.hip !== undefined) entry.hip = circ.hip;
        if (circ.neck) entry.neck = circ.neck;
        measurementData.push(entry);
    }

    measurementData.sort((a,b) => parseLocalDate(a.date) - parseLocalDate(b.date));

    pruneOldMeasurements();
    saveToLocalStorage();

    updateChart();
    updateBMI();
    updateLastMeasurementInfo();

    weightInput.value = '';
    if (currentHeightUnit === 'cm') {
        if (heightInput) heightInput.value = '';
    } else {
        if (feetInput) feetInput.value = '';
        if (inchesInput) inchesInput.value = '';
    }
    setTodayDate();

    showNotification(translations[currentLanguage]['measurement-saved']);
}

function updateLastMeasurementInfo() {
    const infoEl = document.getElementById('lastMeasurementInfo');
    if (!infoEl) return;

    if (measurementData.length === 0) {
        infoEl.textContent = '';
        return;
    }

    const last = measurementData[measurementData.length - 1];
    const d = parseLocalDate(last.date);
    const formatted = d.toLocaleDateString(getLanguageCode());

    const tmpl = translations[currentLanguage]['last-measurement'];
    infoEl.textContent = tmpl
        .replace('{weight}', formatWeightForDisplay(last.weight))
        .replace('{height}', formatHeightForDisplay(last.height))
        .replace('{date}', formatted);
}

function updateBMI() {
    const bmiScoreEl = document.getElementById('bmiScore');
    const bmiCatEl = document.getElementById('bmiCategory');
    const bfEl = document.getElementById('bodyFatValue');
    if (!bmiScoreEl || !bmiCatEl) return;

    if (measurementData.length === 0) {
        bmiScoreEl.textContent = '--';
        bmiCatEl.textContent = '--';
        bmiCatEl.className = 'bmi-category';
        if (bfEl) bfEl.textContent = '--';
        return;
    }

    const latest = measurementData[measurementData.length - 1];
    const weight = latest.weight;
    const heightM = latest.height / 100.0;
    const bmi = weight / (heightM * heightM);

    let categoryKey;
    let cls;
    if (bmi < 18.5) {
        categoryKey = 'bmi-underweight';
        cls = 'bmi-category-underweight';
    } else if (bmi < 25) {
        categoryKey = 'bmi-normal';
        cls = 'bmi-category-normal';
    } else if (bmi < 30) {
        categoryKey = 'bmi-overweight';
        cls = 'bmi-category-overweight';
    } else if (bmi < 40) {
        categoryKey = 'bmi-obese';
        cls = 'bmi-category-obese';
    } else {
        categoryKey = 'bmi-severely-obese';
        cls = 'bmi-category-severely-obese';
    }

    bmiScoreEl.textContent = bmi.toFixed(1);
    bmiCatEl.textContent = translations[currentLanguage][categoryKey];
    bmiCatEl.className = 'bmi-category ' + cls;

    // Body fat estimate (US Navy method)
    if (bfEl) {
        const latest = measurementData[measurementData.length - 1];
        const genderStr = latest.gender;
        const heightCm = latest.height;
        const waistCm = latest.waist;
        const neckCm = latest.neck;
        const hipCm = latest.hip;
        const toIn = (cm) => cm / CM_PER_INCH;
        let bodyFat = null;
        if (genderStr === 'male') {
            if (Number.isFinite(waistCm) && Number.isFinite(neckCm) && Number.isFinite(heightCm)) {
                const w = toIn(waistCm);
                const n = toIn(neckCm);
                const h = toIn(heightCm);
                const denom = 1.0324 - 0.19077 * Math.log10(Math.max(0.1, w - n)) + 0.15456 * Math.log10(h);
                bodyFat = 495 / denom - 450;
            }
        } else if (genderStr === 'female') {
            if (Number.isFinite(waistCm) && Number.isFinite(hipCm) && Number.isFinite(neckCm) && Number.isFinite(heightCm)) {
                const w = toIn(waistCm);
                const hp = toIn(hipCm);
                const n = toIn(neckCm);
                const h = toIn(heightCm);
                const denom = 1.29579 - 0.35004 * Math.log10(Math.max(0.1, w + hp - n)) + 0.22100 * Math.log10(h);
                bodyFat = 495 / denom - 450;
            }
        }
        bfEl.textContent = (bodyFat !== null && Number.isFinite(bodyFat)) ? `${bodyFat.toFixed(1)}%` : '--';

        // BMR and TDEE
        const bmrEl = document.getElementById('bmrValue');
        const tdeeEl = document.getElementById('tdeeValue');
        let bmr = null;
        if (Number.isFinite(bodyFat) && latest && Number.isFinite(latest.weight)) {
            const lbm = latest.weight * (1 - bodyFat/100);
            bmr = 370 + 21.6 * lbm;
        }
        if (bmrEl) bmrEl.textContent = Number.isFinite(bmr) ? `${Math.round(bmr)}` : '--';
        const factor = currentActivityLevel || 1.2;
        if (tdeeEl) {
            const tdee = Number.isFinite(bmr) ? Math.round(bmr * factor) : null;
            tdeeEl.textContent = Number.isFinite(tdee) ? `${tdee}` : '--';
        }
    }
}

/* =========================
   CHART
========================= */
function initializeChart() {
    const canvas = document.getElementById('chartCanvas');
    const container = document.getElementById('weightChart');

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = 300 * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = '300px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    canvas.addEventListener('mousemove', handleChartMouseMove);
    canvas.addEventListener('mouseleave', hideChartTooltip);

    chartInitialized = true;
}

function updateChart() {
    const canvas = document.getElementById('chartCanvas');
    if (!canvas) return;

    const container = document.getElementById('weightChart');
    const dpr = window.devicePixelRatio || 1;

    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 300 * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = '300px';

    const ctx = canvas.getContext('2d');
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(dpr, dpr);

    if (measurementData.length === 0) {
        drawNoData(ctx, canvas, translations[currentLanguage]['no-data']);
        canvas.chartData = {points: []};
        return;
    }

    // keep only last 90 days INCLUDING TODAY for chart display
    const todayLocal = new Date();
    const startDate = new Date(todayLocal);
    startDate.setHours(0,0,0,0);
    startDate.setDate(startDate.getDate() - MEASUREMENT_KEEP_DAYS);

    const endDate = new Date(todayLocal);
    endDate.setHours(23,59,59,999);

    let filtered = measurementData.filter(entry => {
        const d = parseLocalDate(entry.date);
        return d >= startDate && d <= endDate;
    });

    if (filtered.length === 0) {
        drawNoData(ctx, canvas, translations[currentLanguage]['no-data-period']);
        canvas.chartData = {points: []};
        return;
    }

    const paddingLeft = 60;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 40;

    const chartW = canvas.width/dpr - paddingLeft - paddingRight;
    const chartH = canvas.height/dpr - paddingTop - paddingBottom;

    // Determine values and units based on selected metric
    const inLabel = (translations[currentLanguage] || {})['unit-in-short'] || 'in';
    const cmLabel = (translations[currentLanguage] || {})['unit-cm-short'] || 'cm';

    const toIn = (cm) => cm / CM_PER_INCH;

    let values = [];
    let unitLabel = '';
    if (currentChartMetric === 'weight') {
        values = filtered.map(e => weightToDisplayValue(e.weight));
        unitLabel = getCurrentWeightUnitShortLabel();
    } else if (currentChartMetric === 'waist' || currentChartMetric === 'hip' || currentChartMetric === 'neck') {
        values = filtered.map(e => e[currentChartMetric]);
        unitLabel = (currentHeightUnit === 'ftin') ? inLabel : cmLabel;
        if (currentHeightUnit === 'ftin') values = values.map(v => v/CM_PER_INCH);
    } else if (currentChartMetric === 'bmi') {
        values = filtered.map(e => {
            if (!Number.isFinite(e.height) || !Number.isFinite(e.weight)) return NaN;
            const hM = e.height/100.0; return e.weight/(hM*hM);
        }).filter(v => Number.isFinite(v));
        unitLabel = '';
    } else if (currentChartMetric === 'bodyfat') {
        values = filtered.map(e => {
            if (e.gender === 'male' && Number.isFinite(e.waist) && Number.isFinite(e.neck) && Number.isFinite(e.height)) {
                const w = toIn(e.waist), n = toIn(e.neck), h = toIn(e.height);
                const denom = 1.0324 - 0.19077*Math.log10(Math.max(0.1, w-n)) + 0.15456*Math.log10(h);
                return 495/denom - 450;
            } else if (e.gender === 'female' && Number.isFinite(e.waist) && Number.isFinite(e.hip) && Number.isFinite(e.neck) && Number.isFinite(e.height)) {
                const w = toIn(e.waist), hp = toIn(e.hip), n = toIn(e.neck), h = toIn(e.height);
                const denom = 1.29579 - 0.35004*Math.log10(Math.max(0.1, w+hp-n)) + 0.22100*Math.log10(h);
                return 495/denom - 450;
            }
            return NaN;
        }).filter(v => Number.isFinite(v));
        unitLabel = '%';
    }

    // Filter out NaN values (for metrics where not all entries have data)
    if (currentChartMetric !== 'weight') {
        const newFiltered = [];
        const newValues = [];
        values.forEach((v, idx) => { if (Number.isFinite(v)) { newFiltered.push(filtered[idx]); newValues.push(v); } });
        filtered = newFiltered; values = newValues;
    }

    // guard
    if (values.length === 0) {
        drawNoData(ctx, canvas, translations[currentLanguage]['no-data-period']);
        canvas.chartData = {points: []};
        return;
    }

    let minW = Math.min(...values);
    let maxW = Math.max(...values);
    const pad = (maxW - minW) * 0.1 || 5;
    minW = Math.max(0, minW - pad);
    maxW = maxW + pad;

    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
    ctx.lineWidth = 1;

    // Y axis
    ctx.beginPath();
    ctx.moveTo(paddingLeft, paddingTop);
    ctx.lineTo(paddingLeft, paddingTop + chartH);
    ctx.stroke();

    // X axis
    ctx.beginPath();
    ctx.moveTo(paddingLeft, paddingTop + chartH);
    ctx.lineTo(paddingLeft + chartW, paddingTop + chartH);
    ctx.stroke();

    // Y ticks
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
    ctx.font = '11px Arial';
    ctx.textAlign = 'right';

    const ySteps = 5;
    for (let i=0; i<=ySteps; i++) {
        const ratio = i / ySteps;
        const yVal = maxW - (maxW - minW)*ratio;
        const yPos = paddingTop + chartH * ratio;
        const label = `${formatNumber(yVal, 1)} ${unitLabel}`.trim();

        ctx.fillText(label, paddingLeft - 8, yPos + 4);

        ctx.beginPath();
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
        ctx.moveTo(paddingLeft, yPos);
        ctx.lineTo(paddingLeft + chartW, yPos);
        ctx.stroke();
    }

    // X ticks
    ctx.textAlign = 'center';
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
    ctx.font = '11px Arial';

    const step = Math.max(1, Math.floor(filtered.length / 10));
    filtered.forEach((entry, idx) => {
        if (idx % step === 0 || idx === filtered.length - 1) {
            const x = paddingLeft + (chartW / (filtered.length - 1 || 1)) * idx;
            const d = parseLocalDate(entry.date);
            const lbl = d.toLocaleDateString(getLanguageCode(), { month: 'short', day: 'numeric' });
            ctx.fillText(lbl, x, paddingTop + chartH + 20);
        }
    });

    // line
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2;
    ctx.beginPath();

    const points = [];

    filtered.forEach((entry, idx) => {
        let v;
        if (currentChartMetric === 'weight') {
            v = weightToDisplayValue(entry.weight);
        } else if (currentChartMetric === 'waist' || currentChartMetric === 'hip' || currentChartMetric === 'neck') {
            v = currentHeightUnit === 'ftin' ? (entry[currentChartMetric]/CM_PER_INCH) : entry[currentChartMetric];
        } else if (currentChartMetric === 'bmi') {
            if (Number.isFinite(entry.height) && Number.isFinite(entry.weight)) { const hM = entry.height/100.0; v = entry.weight/(hM*hM); } else { v = NaN; }
        } else if (currentChartMetric === 'bodyfat') {
            if (entry.gender === 'male' && Number.isFinite(entry.waist) && Number.isFinite(entry.neck) && Number.isFinite(entry.height)) {
                const w = toIn(entry.waist), n = toIn(entry.neck), h = toIn(entry.height); const denom = 1.0324 - 0.19077*Math.log10(Math.max(0.1, w-n)) + 0.15456*Math.log10(h); v = 495/denom - 450;
            } else if (entry.gender === 'female' && Number.isFinite(entry.waist) && Number.isFinite(entry.hip) && Number.isFinite(entry.neck) && Number.isFinite(entry.height)) {
                const w = toIn(entry.waist), hp = toIn(entry.hip), n = toIn(entry.neck), h = toIn(entry.height); const denom = 1.29579 - 0.35004*Math.log10(Math.max(0.1, w+hp-n)) + 0.22100*Math.log10(h); v = 495/denom - 450;
            } else { v = NaN; }
        }
        if (!Number.isFinite(v)) return;
        const x = paddingLeft + (chartW / (filtered.length - 1 || 1)) * idx;
        const y = paddingTop + chartH - ((v - minW) / (maxW - minW || 1)) * chartH;

        points.push({
            x,
            y,
            valueDisplay: `${formatNumber(v, 1)} ${unitLabel}`.trim(),
            date: parseLocalDate(entry.date).toLocaleDateString(getLanguageCode())
        });

        if (idx === 0) ctx.moveTo(x,y);
        else ctx.lineTo(x,y);
    });
    ctx.stroke();

    // dots
    ctx.fillStyle = primaryColor;
    points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
        ctx.fill();
    });

    canvas.chartData = { points };
}

function drawNoData(ctx, canvas, text) {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';

    const dpr = window.devicePixelRatio || 1;
    ctx.fillText(
        text,
        canvas.width/(2*dpr),
        canvas.height/(2*dpr)
    );
}

function handleChartMouseMove(e) {
    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dpr = window.devicePixelRatio || 1;
    const scaledX = x * dpr;
    const scaledY = y * dpr;

    const data = canvas.chartData;
    if (!data || !data.points) return;

    let hit = null;
    for (const p of data.points) {
        const dx = (p.x * dpr) - scaledX;
        const dy = (p.y * dpr) - scaledY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist <= 8*dpr) {
            hit = p;
            break;
        }
    }

    const tooltip = document.getElementById('chartTooltip');
    if (hit) {
        const label = hit.valueDisplay || hit.weightDisplay;
        tooltip.innerHTML = `<div>${hit.date}</div><div><strong>${label}</strong></div>`;
        tooltip.style.left = (hit.x + 12) + 'px';
        tooltip.style.top = (hit.y - 30) + 'px';
        tooltip.style.display = 'block';
    } else {
        tooltip.style.display = 'none';
    }
}

function hideChartTooltip() {
    const tooltip = document.getElementById('chartTooltip');
    tooltip.style.display = 'none';
}

/* =========================
   TOAST
========================= */
function showNotification(message, type='success') {
    const note = document.getElementById('notification');
    note.textContent = message;
    note.classList.add('show');

    if (type === 'error') {
        note.style.backgroundColor = '#e74c3c';
    } else {
        note.style.backgroundColor =
            getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
    }

    setTimeout(() => {
        note.classList.remove('show');
    }, 3000);
}

/* =========================
   EXPORT / IMPORT
========================= */
function exportDataToFile() {
    const data = {
        version: 1,
        workouts,
        measurementData,
        prefs: {
            language: currentLanguage,
            theme: currentTheme,
            weightUnit: currentWeightUnit,
            heightUnit: currentHeightUnit,
            weekStart
        }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const now = new Date();
    const ts = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
    a.href = url;
    a.download = `fitness-planner-export-${ts}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importDataFromObject(obj) {
    try {
        if (obj.workouts && typeof obj.workouts === 'object') {
            workouts = obj.workouts;
        }
        if (Array.isArray(obj.measurementData)) {
            measurementData = obj.measurementData;
        }
        if (obj.prefs && typeof obj.prefs === 'object') {
            currentLanguage = obj.prefs.language || currentLanguage;
            currentTheme = obj.prefs.theme || currentTheme;
            currentWeightUnit = obj.prefs.weightUnit || currentWeightUnit;
            currentHeightUnit = obj.prefs.heightUnit || currentHeightUnit;
            if (typeof obj.prefs.weekStart === 'number') weekStart = obj.prefs.weekStart;
        }
    } catch (err) {
        // swallow
    }

    pruneOldMeasurements();
    saveToLocalStorage();
    // Reapply prefs
    setLanguage(currentLanguage);
    setTheme(currentTheme);
    updateWeightUnitUI(true);
    updateHeightUnitUI(true);
    renderWeek();
    updateLastMeasurementInfo();
    updateBMI();
    if (chartInitialized) updateChart();
}
