# 📌 Görseller
<img src="https://media.discordapp.net/attachments/836467887928639498/1226863466401497159/image.png?ex=662650a4&is=6613dba4&hm=3e19e3e0039b6ca1eff0261b6454f79a818a8a7fc9ece7e0968a1531ed12b04d&=&format=webp">
<img src="https://media.discordapp.net/attachments/836467887928639498/1226863591311802389/image.png?ex=662650c2&is=6613dbc2&hm=fbb32ca6b418000e660dda5427d92cde2df07f090e0bb03149b6143f6588107c&=&format=webp">
<img src="https://media.discordapp.net/attachments/836467887928639498/1226863652301176912/image.png?ex=662650d0&is=6613dbd0&hm=685f25a1fec8d42a955e03d573fa6d5f9517c6191b9aceaa8d862494b61cc581&=&format=webp">
<img src="https://media.discordapp.net/attachments/836467887928639498/1226863731330388060/image.png?ex=662650e3&is=6613dbe3&hm=e3a1a95e01e9489c67d11683a660abe6472a7921b3c54c819a56922db3da5a82&=&format=webp">
<img src="https://media.discordapp.net/attachments/836467887928639498/1226865195671093378/image.png?ex=66265240&is=6613dd40&hm=6be9843efdd96cc23858955c96c2e910137603a7a122ac7047da491145356eab&=&format=webp">
<img src="https://media.discordapp.net/attachments/836467887928639498/1226867295138087015/image.png?ex=66265435&is=6613df35&hm=f53914352ee15c05b738bffd3c9c63e5dad916ab2f8561e269577ef6263a38f6&=&format=webp">
<img src="https://media.discordapp.net/attachments/836467895156211772/1226864630220197958/image.png?ex=662651b9&is=6613dcb9&hm=92821f52f6a8a4004145201e978e5dbddfea085bf60d0f6455a5660fd59a1658&=&format=webp">
<img src="https://media.discordapp.net/attachments/836467895156211772/1226864780367757435/image.png?ex=662651dd&is=6613dcdd&hm=214f00fb3e4e9169d3e56dad816648e1055ad1ca8cd503874505bc84a9304015&=&format=webp">

# ✨ Kurulum
### Projeyi botunuzda kullanmak için bazı işlemler yapmanız gerekiyor. Aşağıdaki yönlendirmeleri takip ederek bunu yapabilirsiniz :
* Herkesin bildiği gibi ilk önce bilgisayarınıza [Node JS](https://nodejs.org/tr/) ve ayarları daha rahat yapa bilmek için bir editör *(Örneğin [Visual Studio Code](https://code.visualstudio.com/))* indirmeniz gerekiyor.
* Ve veritabanı için bir [MongoDB](https://mongodb.com/) bağlantı linkinizin olması gerekiyor.
    * Not: Eğer **MongoDB** hakkında bilginiz yoksa [Youtube](https://www.youtube.com/) gibi platformlardan ayrıntılı bilgi ala bilirsiniz.
* Projeyi zip dosyası halinde indirin ve herhangi bir klasöre zip dosyasını çıkarın.
* Sonra editörünüzde `src/configs/settings.js` dosyasına gelerek botunuzun ve sunucunuzun gerekli ayarlarını girin.
* Daha sonra editörünüzün terminalini yada klasörünuzun bulunduğu dizinde `cmd` veya `powershell` penceresini açın.
* Ve `npm i` yazarak otomatik olarak gerekli tüm modülleri indirin.
* Bu işlem de bittikten sonra pencerede `node .` veya `npm start` yazarak botunuzu çalıştırın!
## Glitch kullanıcıları için :
* Glitch platformunda `New Project` butonuna tıklayın, çıkan seçimler arasında en aşağıda bulunan `Import from GitHub` seçeneğine tıklayıp çıkan pencereye bu Altyapının linkini girin ve Tamam'a tıklayın!
* `package.json` dosyasını Glitch'e uygun olarak değiştirin!
* Ve bir kaç sistem hatası almamak için `package.json` dosyasına aşağıdaki kodu girin :
```json
"engines" : {
    "node": "12.x"
}
```

# ⚙️ Ayarlar
### Botunuzun doğru ve hatasız çalışması için `settings.js` dosyasını doğru bir şekilde doldurmanız gerekiyor. Aşağıdaki yönlendirmeleri takip ederek bazı ayarları yapabilirsiniz :

* `client.settings` ve `client.statusMessages` kısmı botunuzun, `client.systemEmojis` kısmı kullanılacak olan emojilerin ve `client.guildSettings` kısmı ise sunucunuzun gerekli ayarlarıdır.
* Botunuzun yapmış olduğum diğer altyapıları kullanan botlarınızla uyumlu olarak çalışması için tüm botlarda `client.settings.MongoURL` kısmına aynı bağlantı linkini ve `client.settings.OtherBots` dizinine diğer botlarınızın Discord'da ki ID'lerini girmelisiniz.
* Altyapıdaki komutların çoğunda yavaş mod mevcuttur ve bunu **Sunucu Yöneticisi** ve **Bot Altı Yönetici** yetkisine sahip yetkililere kapatmak için `client.settings.DisableCooldownsForAdmins` kısmını aktif hale getirebilirsiniz.
* `client.systemEmojis` dizini botunuzun kullanmak için sunucunuza kuracağı emoji bilgilerini gösteriyor. Dizine belirtilen şekilde yeni emoji bilgileri ekleyerek belirttiğiniz emojilerinde sunucunuza kurulmasını sağlaya bilirsiniz. Bu emojilerin kurulması için botunuzu aktifleşdirdikten sonra **Emojikur** komutunu kullanmanız gerekmektedir.
    * Bilgi: **Emojikur** komutunu kullandıktan sonra botunuz emojileri sunucuya kurar ve `src/configs/emojis.json` dosyasına kaydeder. Gerektiği zaman da bu dosyadan alıp kullanır ve sizde tüm emojileri `<:name:id>` şeklinde botunuza kaydetme zahmetinden kurtulursunuz.
    * Not: Bazı kullanıcılarda emojiler `src/configs/emojis.json` dosyasına kaydedilmeye bilir, bu durumda Emojikur komutunu kullandıktan sonra `eval JSON.stringify(emojis, null, 2)` komutunu çalıştırarak çıkan sonucu dosyaya yapıştırarak sorunu hall edebilirsiniz.
    * Not: `src/configs/emojis.json` dosyasında discordun birkaç varsayılan emojileride hazır bulunmaktadır.
* `client.guildSettings.guildTags` dizinine sunucunuzun taglarını, `client.guildSettings.guildDiscriminator` kısmına ise sunucunuzun etiket tagını *(#0000 gibi ve eğer varsa)*  **#** olmadan girmelisiniz.
    * Not: Sunucunuzda etiket tagı kullanmıyorsanız **guildDiscriminator** kısmını silmenize gerek yok. Boş bırakıp botunuza etiket tagınızın olmadığını belirtmelisiniz.
* `client.guildSettings.guildTeams` dizinine sunucunuzdaki bulunan ekiplerin *(Eğer varsa)* her birine özel yapılmış rolün ID'sini girmelisiniz.
* `client.guildSettings.meetRole` kısmına **Toplantıya Katıldı** rolünün, `client.guildSettings.meetChannel` kısmına ise sunucunuzun toplantı kanalının ID'sini girmelisiniz.
* `client.guildSettings.nameTag` kısmına sunucunuzdaki üyelerin sunucu isimlerinin başında bulunacak sembolü gire veya boş bıraka bilirsiniz.
* `client.guildSettings.dmMessages` kısmından üyelere **DM** aracılığıyla gönderilecek mesajları, `client.guildSettings.unAuthorizedMessages` kısmından ise sunucunuzda yeterli yetkisi olmayan üyelerin yetkili komutlarını kullandıkta alıcakları geridönüş mesajını açıp-kapata bilirsiniz.
* `client.guildSettings.staffRoles` dizinine **Genel Yetkili** rollerinizin, `client.guildSettings.transporterSpears` dizinine **Taşıyıcı** rollerinizin, `client.guildSettings.registerSpears` dizinine **Kayıt Yetkilisi** rollerinizin, `client.guildSettings.staffGiver` kısmına **Yetkili Alım** rolünün ve `client.guildSettings.botYt` kısmına ise sunucunuzun **Bot Altı Yönetici** rolünün ID'sini girmelisiniz.
    * Bilgi: **Bot Altı Yönetici** rolü botunuzun %75'lik kısmına diğer roller ihtiyaç olmaksızın erişe bilmesini sağlar. Eğer sunucunuzda botunuzun çoğu komutuna erişip ama **Sunucu Yöneticisi** yetkisini vermek istemediğiniz üyeler varsa onlara bu rolü verebilirsiniz.

📌 Diğer ayarlarıda doğru bir şekilde girerek bu kısmıda başarıyla tamamlaya bilirsiniz!

# ⚡ İletişim
### Eğer bir hatayla karşılaşıyor veya botunuzu kurmakta sorun yaşıyorsanız aşağıdaki bağlantılardan bana ulaşabilirsiniz :
* [Discord Sunucum](https://discord.gg/MTNkXHnX3b)
* [Ana Hesabım](https://discord.com/users/624914071984013313)
* [Yan Hesabım](https://discord.com/users/809325505304068096)

## Önemli: Proje MIT lisansına sahiptir ve projenin dosyalarının izin alınmadan paylaşılması, satılması  veya benzeri durumlar kesinlikle yasaktır. Böyle bir durumun yaşanması sonucunda bundan sorumlu şahıs(lar)a gerekli işlemler yapılacaktır!
